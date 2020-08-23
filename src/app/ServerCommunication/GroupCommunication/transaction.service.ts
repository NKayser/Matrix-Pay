import { Injectable } from '@angular/core';
import {ClientInterface} from '../CommunicationInterface/ClientInterface';
import {MatrixClientService} from '../CommunicationInterface/matrix-client.service';
import {ServerResponse} from '../Response/ServerResponse';
import {UnsuccessfulResponse} from '../Response/UnsuccessfulResponse';
import {GroupError} from '../Response/ErrorTypes';
import {SuccessfulResponse} from '../Response/SuccessfulResponse';
// @ts-ignore
import {MatrixEvent} from 'matrix-js-sdk';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private matrixClientService: ClientInterface;

  private static readonly MESSAGE_TYPE_EXPENSE: string = 'com.matrixpay.expense';
  private static readonly MESSAGE_TYPE_PAYBACK: string = 'com.matrixpay.payback';

  constructor(matrixClientService: MatrixClientService) {
    this.matrixClientService = matrixClientService;
  }

  /**
   * Create a transaction (payback or expense). Returns a ServerResponse with the event_id of that transaction as a
   * value if successful.
   *
   * @param groupId The Matrix Room Id
   * @param description Title of the transaction (what was it for)
   * @param payerId User Id of the payer of the transaction
   * @param recipientIds User Ids of the recipients in this transaction
   * @param amounts How much money each recipient received, in Cents. Same order as recipient array. Should all be
   * positive.
   * @param isPayback
   */
  public async createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amounts: number[], isPayback: boolean): Promise<ServerResponse> {
    const messageType = isPayback ? TransactionService.MESSAGE_TYPE_PAYBACK : TransactionService.MESSAGE_TYPE_EXPENSE;

    const content = {
      'name': description,
      'payer': payerId,
      'recipients': recipientIds,
      'amounts': amounts
    };

    return this.sendTransaction(groupId, messageType, content, recipientIds, payerId);
  }

  // Not in use yet.
  public async modifyTransaction(groupId: string, transactionId: string, description?: string, payerId?: string, recipientIds?: string[], amounts?: number[]): Promise<ServerResponse> {
    // Check if referenced Transaction exists. Should already be validated in ViewModel
    const client = await this.matrixClientService.getClient();
    const oldContent = await client.fetchRoomEvent(groupId, transactionId)
      .catch((reason: string) => {return new UnsuccessfulResponse(GroupError.NoOriginal, reason).promise()});

    console.log(oldContent);

    // Set content to new values if given
    let newDescription: string = description;
    let newPayerId: string = payerId;
    let newRecipientIds: string[] = recipientIds;
    let newAmounts: number[] = amounts;

    // Use old values if new values not given
    if (newDescription == undefined) newDescription = oldContent['content']['name'];
    if (newPayerId == undefined) newPayerId = oldContent['content']['payer'];
    if (newRecipientIds == undefined) newRecipientIds = oldContent['content']['recipients'];
    if (newAmounts == undefined) newAmounts = oldContent['content']['amounts'];

    // Relict, because method not used yet. Actually, the message type should not change.
    const newMessageType = newRecipientIds.length == 1 ? TransactionService.MESSAGE_TYPE_PAYBACK : TransactionService.MESSAGE_TYPE_EXPENSE;

    const newContent = {
      'new_content': {
        'name': newDescription,
        'payer': newPayerId,
        'recipients': newRecipientIds,
        'amounts': newAmounts
      },
      'relates_to': {
        'rel_type': 'replace',
        'event_id': transactionId
      }
    };

    console.log(newContent);

    return this.sendTransaction(groupId, newMessageType, newContent, newRecipientIds, newPayerId);
  }

  private async sendTransaction(groupId: string, messageType: string, content: object, recipientIds: string[],
                                payerId: string): Promise<ServerResponse> {
    const client = await this.matrixClientService.getClient();

    // Input Validation (check if users exist in room). Should already be done in ViewModel.
    const validIds = await this.areGroupMembers(groupId, recipientIds.concat(payerId))
      .catch(() => {return new UnsuccessfulResponse(GroupError.InvalidUsers).promise()});
    if (!validIds) return new UnsuccessfulResponse(GroupError.InvalidUsers).promise();

    let response: ServerResponse;

    // Actually send the event
    const event = await client.sendEvent(groupId, messageType, content, '').then(
        (val: MatrixEvent) => {response = new SuccessfulResponse(val['event_id'])},
        (reason: string) => {response = new UnsuccessfulResponse(GroupError.SendEvent, reason)});

    // Return the new event_id
    return await response;
  }

  // This method was originally used to double check if the userIds are valid.
  // However, this caused errors when members had not accepted the invitation yet.
  private async areGroupMembers(roomId: string, userIds: string[]): Promise<boolean> {
    /*
    const client = await this.matrixClientService.getClient();
    const joined = await client.getJoinedRoomMembers(roomId);
    const members = Object.keys(joined['joined']);
    return userIds.every(val => members.includes(val));
     */
    return true;
  }
}
