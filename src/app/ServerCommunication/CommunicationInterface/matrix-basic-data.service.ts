import { Injectable } from '@angular/core';
import {BasicDataInterface} from './BasicDataInterface';
import {ServerResponse} from '../Response/ServerResponse';
import {GroupService} from '../GroupCommunication/group.service';
import {SettingsService} from '../SettingsCommunication/settings.service';

@Injectable({
  providedIn: 'root'
})
export class MatrixBasicDataService implements BasicDataInterface {
  private groupService: GroupService;
  private settingsService: SettingsService;

  // This service needs groupService and settingsService to forward method calls.
  // Basic Data includes group data and user settings.
  // This service is a fassade for the ServerCommunication Package.

  constructor(groupService: GroupService, settingsService: SettingsService) {
    this.groupService = groupService;
    this.settingsService = settingsService;
  }

  // The following methods will be forwarded to GroupService.

  public confirmPayback(groupId: string, recommendationId: number): Promise<ServerResponse> {
    return this.groupService.confirmRecommendation(groupId, recommendationId);
  }

  public createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amounts: number[], isPayback: boolean): Promise<ServerResponse> {
    return this.groupService.createTransaction(groupId, description, payerId, recipientIds, amounts, isPayback);
  }

  public fetchHistory(groupId: string): Promise<ServerResponse> {
    return this.groupService.fetchHistory(groupId);
  }

  public groupAddMember(groupId: string, contactId: string): Promise<ServerResponse> {
    return this.groupService.addMember(groupId, contactId);
  }

  public groupCreate(name: string, currency: string): Promise<ServerResponse> {
    return this.groupService.createGroup(name, currency);
  }

  public leaveGroup(groupId: string): Promise<ServerResponse> {
    return this.groupService.leaveGroup(groupId);
  }

  public modifyTransaction(groupId: string, transactionId: string, description?: string, payerId?: string,
                           recipientIds?: string[], amounts?: number[]): Promise<ServerResponse> {
    return this.groupService.modifyTransaction(groupId, transactionId, description, payerId, recipientIds, amounts);
  }

  // These methods are being forwarded to the settings service.

  public userChangeDefaultCurrency(currency: string): Promise<ServerResponse> {
    return this.settingsService.changeCurrency(currency);
  }

  public userChangeLanguage(language: string): Promise<ServerResponse> {
    return this.settingsService.changeLanguage(language);
  }
}
