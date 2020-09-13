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
import {EmergentDataInterface} from '../CommunicationInterface/EmergentDataInterface';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  public static readonly ROOM_TYPE_CONTENT_KEY: string = 'room_type';
  public static readonly ROOM_TYPE_CONTENT_VALUE: string = 'MatrixPay';

  private static readonly ROOM_VISIBILITY: string = 'private';
  private static readonly ERRCODE_UNKNOWN: string = 'M_UNKNOWN';
  private static readonly ERRCODE_INUSE: string = 'M_ROOM_IN_USE';
  private static readonly ERRCODE_UNRECOGNIZED: string = 'M_UNRECOGNIZED';
  private static readonly ERRCODE_INVALID_PARAM: string = 'M_INVALID_PARAM';
  private static readonly CURRENCY_KEY: string = 'com.matrixpay.currency';
  private static readonly TYPE_KEY: string = 'org.matrix.msc1840';
  private static readonly MATRIX_PAY_TYPE: string = 'MatrixPay';
  private static readonly RECOMMENDATIONS_KEY: string = 'recommendations';
  private static readonly ACCOUNT_DATA_KEY: string = 'accountData';
  private static readonly SCROLLBACK_LIMIT: number = 30; // this is the default for scrollback anyways
  private static readonly ROOM_TYPE_KEY: string = 'org.matrix.msc1840';

  private transactionService: TransactionService;
  private matrixClientService: ClientInterface;
  private matrixEmergentDataService: EmergentDataInterface;


  // This service needs the transaction Service to forward method calls and the EmergentDataService to confirm Paybacks
  constructor(transactionService: TransactionService,
              matrixClientService: MatrixClientService) {
    this.transactionService = transactionService;
    this.matrixClientService = matrixClientService;
  }

  public async addMember(groupId: string, userId: string): Promise<ServerResponse> {
    // get Client. Method should only be called when client is prepared.
    if (!this.matrixClientService.isPrepared()) {
      throw new Error('Client is not prepared');
    }
    const client: MatrixClient = this.matrixClientService.getClient();

    // Actually send the invite and throw Errors if they were caused by invalid input that should not be have been
    // possible because of checks in the ViewModel.
    try {
      await client.invite(groupId, userId);
    } catch (error) {
      switch (error['data']['errcode']) {
        case GroupService.ERRCODE_UNKNOWN:
        case GroupService.ERRCODE_UNRECOGNIZED:
          throw new Error('GroupId invalid');
        case GroupService.ERRCODE_INVALID_PARAM:
          throw new Error('UserId invalid');
        default:
          throw new Error('unknown error');
      }
    }

    return new SuccessfulResponse();
  }

  public async confirmRecommendation(groupId: string, recommendationId: number): Promise<ServerResponse> {
    if (!this.matrixClientService.isPrepared()){
      throw new Error('Client is not prepared');
    }
    const client: MatrixClient = this.matrixClientService.getClient();

    // Part 1: Find the right recommendation

    // Get the room for the account data
    const room = client.getRoom(groupId);
    if (room === null){
      throw new Error('room not found');
    }

    const accountDataEvent = room[GroupService.ACCOUNT_DATA_KEY][GroupService.RECOMMENDATIONS_KEY];

    if (accountDataEvent === undefined) {
      throw new Error('no recommendations have been saved yet');
    }

    const recommendations = accountDataEvent.getOriginalContent();

    // Input should only be valid recommendation Id, but throw Error if check in ViewModel failed
    if (!Number.isInteger(recommendationId) || recommendationId < 0
      || recommendationId >= recommendations['amounts'].length) {
      throw new Error('invalid recommendation id');
    }

    // Part 1.5: Read data from Recommendation
    const amounts: number[] = recommendations['amounts'];
    const payers: string[] = recommendations['payers'];
    const recipients: string[] = recommendations['recipients'];

    const amount = amounts[recommendationId];
    const payer = payers[recommendationId];
    const recipient = recipients[recommendationId];

    // check if user is the payer of the recommendation. Should already be the case
    if (payer !== await client.getUserId()) {
      throw new Error('user must be payer of the recommendation');
    }

    // Part 2: Create Payback
    const description = 'Payback from ' + payer + ' to ' + recipient + ' for ' + amount;
    const transaction: ServerResponse = await this.createTransaction(groupId, description, payer, [recipient], [amount], true);
    if (!transaction.wasSuccessful()) {
      return transaction;
    }
    const transactionId: string = transaction.getValue();

    // Create new arrays for the updated recommendations
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
   * @param name name of the group
   * @param currency String of the currency that is being used for transactions in this room.
   * @param alias How to find this room. Unique identifier. Optional
   * @param topic option al topic
   */
  public async createGroup(name: string, currency: string, alias?: string, topic?: string): Promise<ServerResponse> {
    const client: MatrixClient = this.matrixClientService.getClient();

    // Alias is optional
    if (alias !== undefined && (alias.includes(' ') || alias.includes(':'))) {
      alias = undefined;
    }

    const options = {
      room_alias_name: alias,
      visibility: GroupService.ROOM_VISIBILITY,
      invite: [],
      name,
      topic
    };

    let room: object;

    // Create Room
    try {
      room = await client.createRoom(options);
    } catch (error) {
      let errCode: number = GroupError.Unknown;
      const errMessage: string = error['data']['error'];

      switch (error['data']['errcode']) {
        case GroupService.ERRCODE_UNKNOWN:
          errCode = GroupError.InvalidName;
          break;
        case GroupService.ERRCODE_INUSE:
          errCode = GroupError.InUse;
          break;
        default:
          break;
      }
      return new UnsuccessfulResponse(errCode, errMessage);
    }

    const roomId: string = room['room_id'];

    // Set the group settings (currency)
    try {
      await client.sendStateEvent(roomId, GroupService.CURRENCY_KEY, {currency}, '');
    } catch (err) {
      return new UnsuccessfulResponse(GroupError.SetCurrency, err);
    }

    // Set the group type (matrix-pay room)
    try {
      await client.sendStateEvent(roomId, GroupService.ROOM_TYPE_KEY,
          {[GroupService.ROOM_TYPE_CONTENT_KEY]: GroupService.ROOM_TYPE_CONTENT_VALUE}, '');
    } catch (err) {
      return new UnsuccessfulResponse(GroupError.SetCurrency, err);
    }

    return new SuccessfulResponse(roomId);
  }

  public async createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amounts: number[],
                                 isPayback: boolean): Promise<ServerResponse> {
    return this.transactionService.createTransaction(groupId, description, payerId, recipientIds, amounts, isPayback);
  }

  public async fetchHistory(groupId: string): Promise<ServerResponse> {
    // Get Client (if prepared)
    if (!this.matrixClientService.isPrepared()){
      throw new Error('Client is not prepared');
    }
    const client: MatrixClient = this.matrixClientService.getClient();

    // Get room, to call scrollback method on this room.
    // This will cause Matrix to send older Events on the EventEmitters of the MatrixClient.
    const room: Room = await client.getRoom(groupId);
    const scrollbackResponse: any = await client.scrollback(room, GroupService.SCROLLBACK_LIMIT);
    return new SuccessfulResponse();
  }

  public async leaveGroup(groupId: string): Promise<ServerResponse> {
    // Get MatrixClient if prepared
    if (!this.matrixClientService.isPrepared()){
      throw new Error('Client is not prepared');
    }
    const client: MatrixClient = this.matrixClientService.getClient();

    // Get room
    const room = client.getRoom(groupId);
    if (room === undefined){
      return new UnsuccessfulResponse(GroupError.RoomNotFound);
    }

    // Leave Group
    try {
      await client.leave(groupId);
    } catch (err) {
      let errCode: number = GroupError.Unknown;
      const errMessage: string = err['data']['error'];

      // Throw error if group does not exist
      switch (err['data']['errcode']) {
        case GroupService.ERRCODE_UNKNOWN:
          errCode = GroupError.RoomNotFound;
          break;
        default:
          break;
      }
      return new UnsuccessfulResponse(errCode, errMessage);
    }

    return new SuccessfulResponse();
  }

  // Not in use yet.
  public async modifyTransaction(groupId: string, transactionId: string, description?: string, payerId?: string,
                                 recipientIds?: string[], amounts?: number[]): Promise<ServerResponse> {
    return this.transactionService.modifyTransaction(groupId, transactionId, description, payerId, recipientIds, amounts);
  }
}
