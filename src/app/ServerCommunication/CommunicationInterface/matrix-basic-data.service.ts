import { Injectable } from '@angular/core';
import {BasicDataInterface} from "./BasicDataInterface";
import {ServerResponse} from "../Response/ServerResponse";

// TODO: delete later
interface Currency {
}
interface Language {
}

@Injectable({
  providedIn: 'root'
})
export class MatrixBasicDataService implements BasicDataInterface {

  constructor() { }

  confirmPayback(amount: number, payerId: string, recipientId: string): ServerResponse {
    return undefined;
  }

  createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amounts: number[]): ServerResponse {
    return undefined;
  }

  fetchHistory(groupId: string): ServerResponse {
    return undefined;
  }

  groupAddMember(groupId: string, contactId: string): ServerResponse {
    return undefined;
  }

  groupCreate(name: string, currency: Currency): ServerResponse {
    return undefined;
  }

  leaveGroup(groupId: string): ServerResponse {
    return undefined;
  }

  modifyTransaction(groupId: string, transactionId: string, description: string, payerId: string, recipientIds: string[], amounts: number[]): ServerResponse {
    return undefined;
  }

  userChangeDefaultCurrency(currency: Currency): ServerResponse {
    return undefined;
  }

  userChangeLanguage(language: Language): ServerResponse {
    return undefined;
  }
}
