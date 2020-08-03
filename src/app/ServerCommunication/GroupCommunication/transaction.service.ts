import { Injectable } from '@angular/core';
import {ClientInterface} from '../CommunicationInterface/ClientInterface';
import {MatrixClientService} from '../CommunicationInterface/matrix-client.service';
import {ServerResponse} from '../Response/ServerResponse';

// TODO: delete later
class ObservableService {
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private matrixClientService: ClientInterface;
  private observableService: ObservableService;

  private static readonly MESSAGE_TYPE_EXPENSE: string = 'expense';
  private static readonly MESSAGE_TYPE_PAYBACK: string = 'payback';

  constructor(matrixClientService: MatrixClientService, observableService: ObservableService) {
    this.matrixClientService = matrixClientService;
    this.observableService = observableService;
  }

  public createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amounts: number[]): ServerResponse {
    // TODO: how do we differentiate between Expenses and Paybacks?
    let messageType = recipientIds.length == 1 ? TransactionService.MESSAGE_TYPE_PAYBACK : TransactionService.MESSAGE_TYPE_EXPENSE;

    // TODO: different for expense / payback? (arrays / values and no plural)
    let content = {
      "name": description,
      "payer": payerId,
      "recipients": recipientIds,
      "amounts": amounts
    };

    return ServerResponse.makeStandardRequest(
      this.matrixClientService.getClient().sendEvent(groupId, messageType, content, ''));
  }

  public modifyTransaction(groupId: string, transactionId: string, description: string, payerId: string, recipientIds: string[], amounts: number[]): ServerResponse {
    let messageType = recipientIds.length == 1 ? TransactionService.MESSAGE_TYPE_PAYBACK : TransactionService.MESSAGE_TYPE_EXPENSE;

    // TODO: modifying events and listening to modified events not tested yet
    let content = {
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

    return ServerResponse.makeStandardRequest(
      this.matrixClientService.getClient().sendEvent(groupId, messageType, content, ''));
  }
}
