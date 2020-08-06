import { Injectable } from '@angular/core';
import {ClientInterface} from '../CommunicationInterface/ClientInterface';
import {MatrixClientService} from '../CommunicationInterface/matrix-client.service';
import {ServerResponse} from '../Response/ServerResponse';
import {UnsuccessfulResponse} from "../Response/UnsuccessfulResponse";
import {GroupError} from "../Response/ErrorTypes";
import {SuccessfulResponse} from "../Response/SuccessfulResponse";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private matrixClientService: ClientInterface;

  private static readonly MESSAGE_TYPE_EXPENSE: string = 'expense';
  private static readonly MESSAGE_TYPE_PAYBACK: string = 'payback';

  constructor(matrixClientService: MatrixClientService) {
    this.matrixClientService = matrixClientService;
  }

  public async createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amounts: number[]): Promise<ServerResponse> {
    // TODO: how do we differentiate between Expenses and Paybacks?
    const messageType = recipientIds.length == 1 ? TransactionService.MESSAGE_TYPE_PAYBACK : TransactionService.MESSAGE_TYPE_EXPENSE;

    // TODO: different for expense / payback? (arrays / values and no plural)
    const content = {
      "name": description,
      "payer": payerId,
      "recipients": recipientIds,
      "amounts": amounts
    };

    const client = await this.matrixClientService.getClient();
    await client.sendEvent(groupId, messageType, content, '')
      .catch((reason: string) => {return new UnsuccessfulResponse(GroupError.SendEvent, reason).promise()});

    return new SuccessfulResponse();
  }

  public async modifyTransaction(groupId: string, transactionId: string, description: string, payerId: string, recipientIds: string[], amounts: number[]): Promise<ServerResponse> {
    const messageType = recipientIds.length == 1 ? TransactionService.MESSAGE_TYPE_PAYBACK : TransactionService.MESSAGE_TYPE_EXPENSE;

    // TODO: modifying events and listening to modified events not tested yet
    const content = {
      "new_content": {
        "name": description,
        "payer": payerId,
        "recipients": recipientIds,
        "amounts": amounts
      },
      "relates_to": {
        "rel_type": "replace",
        "event_id": transactionId
      }
    };

    const client = await this.matrixClientService.getClient();
    await client.sendEvent(groupId, messageType, content, '')
      .catch((reason: string) => {return new UnsuccessfulResponse(GroupError.SendEvent, reason).promise()});

    return new SuccessfulResponse();
  }
}
