import { Injectable } from '@angular/core';
// @ts-ignore
import {MatrixClient, MatrixEvent} from 'matrix-js-sdk';

import {ClientInterface} from '../CommunicationInterface/ClientInterface';
import {MatrixClientService} from '../CommunicationInterface/matrix-client.service';
import {ServerResponse} from '../Response/ServerResponse';
import {ObservableService} from '../CommunicationInterface/observable.service';
import {SuccessfulResponse} from '../Response/SuccessfulResponse';
import {UnsuccessfulResponse} from '../Response/UnsuccessfulResponse';
import {SettingsError} from "../Response/ErrorTypes";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private matrixClientService: ClientInterface;
  private observableService: ObservableService;

  private static readonly CURRENCY_CONTENT_KEY: string = 'currency';
  private static readonly LANGUAGE_CONTENT_KEY: string = 'language';

  constructor(matrixClientService: MatrixClientService, observableService: ObservableService) {
    this.matrixClientService = matrixClientService;
    this.observableService = observableService;
  }

  /**
   * Change the default currency of the User, which is saved individually for that User in their account data.
   * @param currency The new string value of the default currency setting of that User.
   */
  public async changeCurrency(currency: string): Promise<ServerResponse> {
    // Get Client. This method should only be called when logged in, so this should always work
    const client: MatrixClient = await this.matrixClientService.getClient()
      .catch(() => {return new UnsuccessfulResponse(SettingsError.NoClient).promise()});

    // Set Value
    await client.setAccountData(SettingsService.CURRENCY_CONTENT_KEY, {currency})
      .catch((err: string) => {return new UnsuccessfulResponse(SettingsError.Setter, err).promise()});

    // Check if value was actually changed
    // Event of type
    // {event: {type: "currency", content: {currency: "EURO"}}, sender: null, target: null, status: null, error: null, …}
    const getValue: MatrixEvent = await client.getAccountDataFromServer(SettingsService.CURRENCY_CONTENT_KEY);
    console.log(getValue);

    if (getValue[SettingsService.CURRENCY_CONTENT_KEY] == currency) {
      return new SuccessfulResponse();
    } else {
      return new UnsuccessfulResponse(SettingsError.Getter, getValue["error"]).promise();
    }
  }

  /**
   * Change the default language of the User, which is saved individually for that User in their account data.
   * @param language The new string value of the default language setting of that User.
   */
  public async changeLanguage(language: string): Promise<ServerResponse> {
    // Get Client. This method should only be called when logged in, so this should always work
    const client: MatrixClient = await this.matrixClientService.getClient()
      .catch(() => {return new UnsuccessfulResponse(SettingsError.NoClient).promise()});

    // Set Value
    await client.setAccountData(SettingsService.LANGUAGE_CONTENT_KEY, {language})
      .catch((err: string) => {return new UnsuccessfulResponse(SettingsError.Setter, err).promise()});

    // Check if value was actually changed
    // Event of type
    // {event: {type: "language", content: {language: "EN"}}, sender: null, target: null, status: null, error: null, …}
    const getValue: MatrixEvent = await client.getAccountDataFromServer(SettingsService.LANGUAGE_CONTENT_KEY);
    console.log(getValue);

    if (getValue[SettingsService.LANGUAGE_CONTENT_KEY] == language) {
      return new SuccessfulResponse();
    } else {
      return new UnsuccessfulResponse(SettingsError.Getter, getValue["error"]).promise();
    }
  }
}
