import { Injectable } from '@angular/core';
// @ts-ignore
import {MatrixClient, Room} from 'matrix-js-sdk';

import {TransactionService} from './transaction.service';
import {MatrixClientService} from '../CommunicationInterface/matrix-client.service';
import {ClientInterface} from '../CommunicationInterface/ClientInterface';
import {ServerResponse} from '../Response/ServerResponse';
import {UnsuccessfulResponse} from '../Response/UnsuccessfulResponse';
import {GroupError} from '../Response/ErrorTypes';
import {SuccessfulResponse} from '../Response/SuccessfulResponse';
import {MatrixEmergentDataService} from '../CommunicationInterface/matrix-emergent-data.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private transactionService: TransactionService;
  private matrixClientService: ClientInterface;

  private static readonly ROOM_VISIBILITY: string = 'private';
  private static readonly ERRCODE_UNKNOWN: string = 'M_UNKNOWN';
  private static readonly ERRCODE_INUSE: string = 'M_ROOM_IN_USE';
  private static readonly ERRCODE_UNRECOGNIZED: string = 'M_UNRECOGNIZED';
  private static readonly ERRCODE_INVALID_PARAM: string = 'M_INVALID_PARAM';
  private static readonly CURRENCY_KEY: string = 'com.matrixpay.currency';
  private static readonly RECOMMENDATIONS_KEY: string = 'recommendations';
  private static readonly ACCOUNT_DATA_KEY: string = 'accountData';
  private static readonly SCROLLBACK_LIMIT: number = 30; // this is the default for scrollback anyways

  constructor(transactionService: TransactionService,
              matrixClientService: MatrixClientService,
              private matrixEmergentDataService: MatrixEmergentDataService) {
    this.transactionService = transactionService;
    this.matrixClientService = matrixClientService;
  }

  /**
   *
   * @param groupId
   * @param userId
   */
  public async addMember(groupId: string, userId: string): Promise<ServerResponse> {
    if (!this.matrixClientService.isPrepared()) throw new Error("Client is not prepared");
    const client: MatrixClient = this.matrixClientService.getClient();
    let response: ServerResponse;
    await client.invite(groupId, userId).then(() => {
      response = new SuccessfulResponse();
    },
      (err) => {
      let errCode: number = GroupError.Unknown;
      const errMessage: string = err['data']['error'];

      switch (err['data']['errcode']) {
        case GroupService.ERRCODE_UNKNOWN:
        case GroupService.ERRCODE_UNRECOGNIZED:
          errCode = GroupError.RoomNotFound;
          break;
        case GroupService.ERRCODE_INVALID_PARAM:
          errCode = GroupError.InvalidUsers;
          break;
        default:
          break;
      }
      response = new UnsuccessfulResponse(errCode, errMessage);
    });

    return await response;
  }

  /**
   *
   * @param groupId
   * @param recommendationId
   */
  // TODO: almost works. Sometimes there is a weird encryption error when creating the transaction.
  public async confirmRecommendation(groupId: string, recommendationId: number): Promise<ServerResponse> {
    // TODO: seperate into private methods and avoid magic numbers
    if (!this.matrixClientService.isPrepared()) throw new Error("Client is not prepared");
    const client: MatrixClient = this.matrixClientService.getClient();

    // Part 1: Find the right recommendation
    const room = client.getRoom(groupId);
    const accountDataEvent = room[GroupService.ACCOUNT_DATA_KEY][GroupService.RECOMMENDATIONS_KEY];

    if (accountDataEvent == undefined) return new UnsuccessfulResponse(GroupError.NoRecommendations,
      'no recommendations have been saved yet');

    const recommendations = accountDataEvent.getOriginalContent();

    if (!Number.isInteger(recommendationId) || recommendationId < 0
      || recommendationId >= recommendations['amounts'].length) {
      return new UnsuccessfulResponse(GroupError.InvalidRecommendationId, 'invalid recommendation id');
    }

    // Part 1.5: Read data from Recommendation
    const amounts: number[] = recommendations['amounts'];
    const payers: string[] = recommendations['payers'];
    const recipients: string[] = recommendations['recipients'];

    const amount = amounts[recommendationId];
    const payer = payers[recommendationId];
    const recipient = recipients[recommendationId];

    // check if user is the payer of the recommendation. Should already be the case
    if (payer != await client.getUserId()) {
      return new UnsuccessfulResponse(GroupError.Unauthorized, 'user must be payer of the recommendation');
    }

    // Part 2: Create Payback
    const description = 'Payback from ' + payer + ' to ' + recipient + ' for ' + amount;
    const transaction: ServerResponse = await this.createTransaction(groupId, description, payer, [recipient], [amount], true);
    if (!transaction.wasSuccessful()) {
      return transaction;
    }
    const transactionId: string = transaction.getValue();

    amounts.splice(recommendationId, 1);
    payers.splice(recommendationId, 1);
    recipients.splice(recommendationId, 1);

    // Part 3: delete Recommendation
    await this.matrixEmergentDataService.setRecommendations(groupId, amounts, payers, recipients, transactionId);
    return new SuccessfulResponse(transactionId);
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

  /**
   *
   * @param groupId
   * @param description
   * @param payerId
   * @param recipientIds
   * @param amounts
   * @param isPayback
   */
  public async createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amounts: number[], isPayback: boolean): Promise<ServerResponse> {
    return this.transactionService.createTransaction(groupId, description, payerId, recipientIds, amounts, isPayback);
  }

  /**
   * Load older room events.
   *
   * @param groupId
   */
  public async fetchHistory(groupId: string): Promise<ServerResponse> {
    if (!this.matrixClientService.isPrepared()) throw new Error("Client is not prepared");
    const client: MatrixClient = await this.matrixClientService.getClient();
    const room: Room = await client.getRoom(groupId);
    const scrollbackResponse: any = await client.scrollback(room, GroupService.SCROLLBACK_LIMIT);
    return new SuccessfulResponse();
  }

  /**
   *
   * @param groupId
   */
  public async leaveGroup(groupId: string): Promise<ServerResponse> {
    if (!this.matrixClientService.isPrepared()) throw new Error("Client is not prepared");
    const client: MatrixClient = await this.matrixClientService.getClient();

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

  /**
   *
   * @param groupId
   * @param transactionId
   * @param description
   * @param payerId
   * @param recipientIds
   * @param amounts
   */
  public async modifyTransaction(groupId: string, transactionId: string, description: string, payerId: string,
                           recipientIds: string[], amounts: number[]): Promise<ServerResponse> {
    return this.transactionService.modifyTransaction(groupId, transactionId, description, payerId, recipientIds, amounts);
  }
}
