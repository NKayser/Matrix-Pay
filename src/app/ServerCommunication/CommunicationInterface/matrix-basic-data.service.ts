import { Injectable } from '@angular/core';
import {BasicDataInterface} from "./BasicDataInterface";
import {ServerResponse} from "../Response/ServerResponse";
import {GroupService} from "../GroupCommunication/group.service";
import {SettingsService} from "../SettingsCommunication/settings.service";

// TODO: delete later
interface Currency {
}
interface Language {
}

@Injectable({
  providedIn: 'root'
})
export class MatrixBasicDataService implements BasicDataInterface {
  private groupService: GroupService;
  private settingsService: SettingsService;

  constructor(groupService: GroupService, settingsService: SettingsService) {
    this.groupService = groupService;
    this.settingsService = settingsService;
  }

  public confirmPayback(amount: number, payerId: string, recipientId: string): ServerResponse {
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

  public groupCreate(name: string, currency: Currency): ServerResponse {
    return this.groupService.createGroup(name, currency);
  }

  public leaveGroup(groupId: string): ServerResponse {
    return undefined;
  }

  public modifyTransaction(groupId: string, transactionId: string, description: string, payerId: string, recipientIds: string[], amounts: number[]): ServerResponse {
    return undefined;
  }

  public userChangeDefaultCurrency(currency: Currency): ServerResponse {
    return undefined;
  }

  public userChangeLanguage(language: Language): ServerResponse {
    return undefined;
  }
}
