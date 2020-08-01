import { Injectable } from '@angular/core';
import {ClientInterface} from "../CommunicationInterface/ClientInterface";
import {MatrixClientService} from "../CommunicationInterface/matrix-client.service";
import {ServerResponse} from "../Response/ServerResponse";

// TODO: delete later
class ObservableService {
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private matrixClientService: ClientInterface;
  private observableService: ObservableService;

  constructor(matrixClientService: MatrixClientService, observableService: ObservableService) {
    this.matrixClientService = matrixClientService;
    this.observableService = observableService;
  }

  public createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amoungs: number[]): ServerResponse {
    return undefined;
  }

  public modifyTransaction(groupId: string, transactionId: string, description: string, payerId: string, recipientIds: string, amounts: int): ServerResponse {
    return undefined;
  }
}
