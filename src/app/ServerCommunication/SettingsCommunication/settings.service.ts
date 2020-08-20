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
  private matrixClientService: ClientInterface;

  private static readonly CURRENCY_CONTENT_KEY: string = 'com.matrixpay.currency';
  private static readonly LANGUAGE_CONTENT_KEY: string = 'com.matrixpay.language';

  constructor(matrixClientService: MatrixClientService) {
    this.matrixClientService = matrixClientService;
  }

  /**
   * Change the default currency of the User, which is saved individually for that User in their account data.
   * @param currency The new string value of the default currency setting of that User.
   */
  public async changeCurrency(currency: string): Promise<ServerResponse> {
    const client: MatrixClient = await this.matrixClientService.getClient();

    // Set Value
    let response: ServerResponse;
    await client.setAccountData(SettingsService.CURRENCY_CONTENT_KEY,
      {[SettingsService.CURRENCY_CONTENT_KEY]: currency}).then(
      () => response = new SuccessfulResponse(),
      (err: string) => response = new UnsuccessfulResponse(SettingsError.Setter, err));

    return await response;

    // Check if value was actually changed
    // Event of type
    // {event: {type: "currency", content: {currency: "EURO"}}, sender: null, target: null, status: null, error: null, …}
    /*
    const getValue: MatrixEvent = await client.getAccountDataFromServer(SettingsService.CURRENCY_CONTENT_KEY);
    console.log(getValue);

    if (getValue[SettingsService.CURRENCY_CONTENT_KEY] == currency) {
      return new SuccessfulResponse();
    } else {
      return new UnsuccessfulResponse(SettingsError.Getter, getValue["error"]).promise();
    }*/
  }

  /**
   * Change the default language of the User, which is saved individually for that User in their account data.
   * @param language The new string value of the default language setting of that User.
   */
  public async changeLanguage(language: string): Promise<ServerResponse> {
    const client: MatrixClient = await this.matrixClientService.getClient();

    // Set Value
    let response: ServerResponse;
    await client.setAccountData(SettingsService.LANGUAGE_CONTENT_KEY,
      {[SettingsService.LANGUAGE_CONTENT_KEY]: language}).then(
      () => response = new SuccessfulResponse(),
      (err: string) => response = new UnsuccessfulResponse(SettingsError.Setter, err));

    return await response;

    // Check if value was actually changed
    // Event of type
    // {event: {type: "language", content: {language: "EN"}}, sender: null, target: null, status: null, error: null, …}
    /*const getValue: MatrixEvent = await client.getAccountDataFromServer(SettingsService.LANGUAGE_CONTENT_KEY);
    console.log(getValue);

    if (getValue[SettingsService.LANGUAGE_CONTENT_KEY] == language) {
      return new SuccessfulResponse();
    } else {
      return new UnsuccessfulResponse(SettingsError.Getter, getValue["error"]).promise();
    }*/
  }
}
