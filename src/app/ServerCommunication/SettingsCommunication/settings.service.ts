import { Injectable } from '@angular/core';
// @ts-ignore
import {MatrixClient, MatrixEvent} from 'matrix-js-sdk';

import {ClientInterface} from '../CommunicationInterface/ClientInterface';
import {MatrixClientService} from '../CommunicationInterface/matrix-client.service';
import {ServerResponse} from '../Response/ServerResponse';
import {SuccessfulResponse} from '../Response/SuccessfulResponse';
import {UnsuccessfulResponse} from '../Response/UnsuccessfulResponse';
import {SettingsError} from '../Response/ErrorTypes';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private static readonly CURRENCY_CONTENT_KEY: string = 'com.matrixpay.currency';
  private static readonly LANGUAGE_CONTENT_KEY: string = 'com.matrixpay.language';

  private matrixClientService: ClientInterface;

  constructor(matrixClientService: MatrixClientService) {
    this.matrixClientService = matrixClientService;
  }

  /**
   * Change the default currency of the User, which is saved individually for that User in their account data.
   * @param currency The new string value of the default currency setting of that User.
   */
  public async changeCurrency(currency: string): Promise<ServerResponse> {
    // Get Client (if prepared)
    if (!this.matrixClientService.isPrepared()) {
      throw new Error('Client is not prepared');
    }
    const client: MatrixClient = this.matrixClientService.getClient();

    // Set Value
    try {
      await client.setAccountData(SettingsService.CURRENCY_CONTENT_KEY, {currency});
    } catch (err) {
      return new UnsuccessfulResponse(SettingsError.Setter, err);
    }

    return new SuccessfulResponse();

    // Don't check if value was actually changed, because this can take a while and caused Errors.
  }

  /**
   * Change the default language of the User, which is saved individually for that User in their account data.
   * @param language The new string value of the default language setting of that User.
   */
  public async changeLanguage(language: string): Promise<ServerResponse> {
    if (!this.matrixClientService.isPrepared()) {
      throw new Error('Client is not prepared');
    }
    const client: MatrixClient = this.matrixClientService.getClient();

    // Set Value
    try {
      await client.setAccountData(SettingsService.LANGUAGE_CONTENT_KEY, {language});
    } catch (err) {
      return new UnsuccessfulResponse(SettingsError.Setter, err);
    }

    return new SuccessfulResponse();
  }
}
