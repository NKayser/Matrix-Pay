import { Injectable } from '@angular/core';
import {EmergentDataInterface} from "./EmergentDataInterface";
import {ServerResponse} from "../Response/ServerResponse";

@Injectable({
  providedIn: 'root'
})
export class MatrixEmergentDataService implements EmergentDataInterface {

  constructor() { }

  setBalances(groupId: string, balances: number[], contactsIds: string[]): ServerResponse {
    return undefined;
  }

  setRecommendations(groupId: string, amounts: number[], payerIds: string[], recipientIds: string[]): ServerResponse {
    return undefined;
  }
}
