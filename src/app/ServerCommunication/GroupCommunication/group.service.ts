import { Injectable } from '@angular/core';
// @ts-ignore
import { MatrixClient } from 'matrix-js-sdk';

import {TransactionService} from './transaction.service';
import {MatrixClientService} from '../CommunicationInterface/matrix-client.service';
import {ClientInterface} from '../CommunicationInterface/ClientInterface';
import {ServerResponse} from '../Response/ServerResponse';
import {UnsuccessfulResponse} from '../Response/UnsuccessfulResponse';
import {GroupError} from '../Response/ErrorTypes';
import {SuccessfulResponse} from '../Response/SuccessfulResponse';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private transactionService: TransactionService;
  private matrixClientService: ClientInterface;

  private static readonly ROOM_VISIBILITY: string = 'private';
  private static readonly ERRCODE_UNKNOWN: string = 'M_UNKNOWN';
  private static readonly ERRCODE_INUSE: string = 'M_ROOM_IN_USE';
  private static readonly CURRENCY_KEY: string = 'currency';

  constructor(transactionService: TransactionService, matrixClientService: MatrixClientService) {
    this.transactionService = transactionService;
    this.matrixClientService = matrixClientService;
  }

  public async addMember(groupId: string, userId: string): Promise<ServerResponse> {
    const client: MatrixClient = await this.matrixClientService.getClient();
    return client.inviteUserToGroup(groupId, userId);
  }

  public async confirmRecommendation(groupId: string, recommendationId: number): Promise<ServerResponse> {
    // TODO: seperate into private methods and avoid magic numbers
    const client: MatrixClient = await this.matrixClientService.getClient();

    // Part 1: Find the right recommendation
    const accountDataEvents = client.getRoom(groupId)['account_data']['events'];
    let recommendations = null;

    for (const event of accountDataEvents['type']) {
      if (event['type'] == 'recommendations') {
        recommendations = event;
      }
    }

    if (recommendations == null) {
      return new UnsuccessfulResponse(0, 'recommendation not found');
    }

    if (!Number.isInteger(recommendationId) || recommendationId < 0
      || recommendationId >= recommendations['amounts'].length) {
      return new UnsuccessfulResponse(0, 'invalid recommendation id');
    }

    // Part 1.5: Read data from Recommendation
    const recipient = recommendations['recipients'][recommendationId];
    const payer = recommendations['payers'][recommendationId];
    const amount = recommendations['amounts'][recommendationId];

    if (payer != client.getUserId()) {
      return new UnsuccessfulResponse(0, 'user not payer of recommendation');
    }

    // Part 2: Create Payback
    const transaction = await this.createTransaction(groupId, 'Payback', payer, [recipient], [amount]);
    if (!transaction.wasSuccessful()) {
      return transaction;
    }

    // Part 3: delete Recommendation
    recommendations.splice(recommendationId, 1);
    return client.setRoomAccountData(groupId, 'recommendations', recommendations);
  }

  /**
   * Create a new room. This can take a while. Returns the room_id as value of Server Response if successful.
   *
   * @param name
   * @param currency String of the currency that is being used for transactions in this room.
   * @param alias How to find this room. Unique identifier. Optional
   * @param topic
   */
  public async createGroup(name: string, currency: string, alias?: string, topic?: string): Promise<ServerResponse> {
    const client: MatrixClient = await this.matrixClientService.getClient();

    if (alias != undefined && (alias.includes(' ') || alias.includes(':'))) {
      alias = undefined;
    }

    const options = {
      'room_alias_name': alias,
      'visibility': GroupService.ROOM_VISIBILITY,
      'invite': [],
      'name': name,
      'topic': topic
    }

    const room = await client.createRoom(options).catch((err: string) => {
      let errCode: number = GroupError.Unknown;
      const errMessage: string = err['data']['error'];

      switch (err['data']['errcode']) {
        case GroupService.ERRCODE_UNKNOWN:
          errCode = GroupError.InvalidName;
          break;
        case GroupService.ERRCODE_INUSE:
          errCode = GroupError.InUse;
          break;
        default:
          break;
      }
      return new UnsuccessfulResponse(errCode, errMessage).promise();
    });
    const roomId: string = room['room_id'];

    await client.sendStateEvent(roomId, GroupService.CURRENCY_KEY, {currency}, GroupService.CURRENCY_KEY)
      .catch((err) => {return new UnsuccessfulResponse(GroupError.SetCurrency, err).promise()});

    return new SuccessfulResponse(roomId);
  }

  public async createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amounts: number[]): Promise<ServerResponse> {
    return this.transactionService.createTransaction(groupId, description, payerId, recipientIds, amounts);
  }

  public async fetchHistory(groupId: string): Promise<ServerResponse> {
    // TODO: implementation unclear. Is syncing already being done automatically in background (-> UpdateService would see this)
    return undefined;
  }

  public async leaveGroup(groupId: string): Promise<ServerResponse> {
    const client: MatrixClient = await this.matrixClientService.getPreparedClient();

    const room = client.getRoom(groupId);
    if (room == undefined) return new UnsuccessfulResponse(GroupError.RoomNotFound).promise();

    await client.leave(groupId).catch((err) => {
      let errCode: number = GroupError.Unknown;
      const errMessage: string = err['data']['error'];

      switch (err['data']['errcode']) {
        case GroupService.ERRCODE_UNKNOWN:
          errCode = GroupError.RoomNotFound;
          break;
        default:
          break;
      }
      return new UnsuccessfulResponse(errCode, errMessage);//.promise();
    });
    return new SuccessfulResponse();
  }

  public async modifyTransaction(groupId: string, transactionId: string, description: string, payerId: string,
                           recipientIds: string[], amounts: number[]): Promise<ServerResponse> {
    return this.transactionService.modifyTransaction(groupId, transactionId, description, payerId, recipientIds, amounts);
  }
}
