import { Injectable } from '@angular/core';
import {EmergentDataInterface} from "./EmergentDataInterface";
import {ServerResponse} from "../Response/ServerResponse";

@Injectable({
  providedIn: 'root'
})
export class MatrixEmergentDataService implements EmergentDataInterface {

  constructor() { }

  public setBalances(groupId: string, balances: number[], contactsIds: string[]): ServerResponse {
    return undefined;
  }

  public setRecommendations(groupId: string, amounts: number[], payerIds: string[], recipientIds: string[]): ServerResponse {
    return undefined;
  }
}
