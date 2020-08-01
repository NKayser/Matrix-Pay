import { Injectable } from '@angular/core';
import {ServerResponse} from "../Response/ServerResponse";
import {TransactionService} from "./transaction.service";
import {MatrixClientService} from "../CommunicationInterface/matrix-client.service";
import {ClientInterface} from "../CommunicationInterface/ClientInterface";

// TODO: delete later
class Currency {
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private transactionService: TransactionService;
  private matrixClientService: ClientInterface;

  constructor(transactionService: TransactionService, matrixClientService: MatrixClientService) {
    this.transactionService = transactionService;
    this.matrixClientService = matrixClientService;
  }

  public addMember(groupId: string, userId: string): ServerResponse {
    return undefined;
  }

  public confirmRecommendation(recommendationId: string, amount: number, payerId: string, recipientId: string): ServerResponse {
    return undefined;
  }

  public createGroup(name: string, currency: Currency): ServerResponse {
    return undefined;
  }

  public createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amounts: number[]): ServerResponse {
    return undefined;
  }

  public fetchHistory(groupId: string): ServerResponse {
    return undefined;
  }

  public groupAddMember(groupId: string, contactId: string): ServerResponse {
    return undefined;
  }

  public leaveGroup(groupId: string): ServerResponse {
    return undefined;
  }

  public modifyTransaction(groupId: string, transactionId: string, description: string, payerId: string, recipientIds: string[], amounts: number[]): ServerResponse {
    return undefined;
  }
}
