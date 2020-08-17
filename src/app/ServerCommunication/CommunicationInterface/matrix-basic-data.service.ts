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

  constructor(groupService: GroupService, settingsService: SettingsService) {
    this.groupService = groupService;
    this.settingsService = settingsService;
  }

  /**
   *
   * @param groupId
   * @param amount
   * @param payerId
   * @param recipientId
   */
  public confirmPayback(groupId: string, recommendationId: number): Promise<ServerResponse> {
    return this.groupService.confirmRecommendation(groupId, recommendationId);
  }

  /**
   *
   * @param groupId
   * @param description
   * @param payerId
   * @param recipientIds
   * @param amounts
   */
  public createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amounts: number[], isPayback: boolean): Promise<ServerResponse> {
    return this.groupService.createTransaction(groupId, description, payerId, recipientIds, amounts, isPayback);
  }

  /**
   *
   * @param groupId
   */
  public fetchHistory(groupId: string): Promise<ServerResponse> {
    return this.groupService.fetchHistory(groupId);
  }

  /**
   *
   * @param groupId
   * @param contactId
   */
  public groupAddMember(groupId: string, contactId: string): Promise<ServerResponse> {
    return this.groupService.addMember(groupId, contactId);
  }

  /**
   *
   * @param name
   * @param currency
   */
  public groupCreate(name: string, currency: string): Promise<ServerResponse> {
    return this.groupService.createGroup(name, currency);
  }

  /**
   *
   * @param groupId
   */
  public leaveGroup(groupId: string): Promise<ServerResponse> {
    return this.groupService.leaveGroup(groupId);
  }

  /**
   *
   * @param groupId
   * @param transactionId
   * @param description
   * @param payerId
   * @param recipientIds
   * @param amounts
   */
  public modifyTransaction(groupId: string, transactionId: string, description?: string, payerId?: string,
                           recipientIds?: string[], amounts?: number[]): Promise<ServerResponse> {
    return this.groupService.modifyTransaction(groupId, transactionId, description, payerId, recipientIds, amounts);
  }

  /**
   *
   * @param currency
   */
  public userChangeDefaultCurrency(currency: string): Promise<ServerResponse> {
    return this.settingsService.changeCurrency(currency);
  }

  /**
   *
   * @param language
   */
  public userChangeLanguage(language: string): Promise<ServerResponse> {
    return this.settingsService.changeLanguage(language);
  }
}
