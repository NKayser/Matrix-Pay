import { Injectable } from '@angular/core';
// @ts-ignore
import {createClient, MatrixClient, AutoDiscovery, MatrixError} from 'matrix-js-sdk';

import { ServerResponse } from '../Response/ServerResponse';
import { ClientInterface } from './ClientInterface';
import {UnsuccessfulResponse} from '../Response/UnsuccessfulResponse';
import {SuccessfulResponse} from '../Response/SuccessfulResponse';
import {ClientError} from '../Response/ErrorTypes';
import {DiscoveredClientConfig} from '../../../matrix';

@Injectable({
  providedIn: 'root'
})
export class MatrixClientService implements ClientInterface {
  private matrixClient: MatrixClient;
  private serverAddress: string;
  private accessToken: string;
  private static loggedIn: boolean = false;
  private static prepared: boolean = false;

  private static readonly ACCOUNT_SEPARATOR: string = ':';
  private static readonly AUTODISCOVERY_SUCCESS: string = 'SUCCESS';
  private static readonly TIMEOUT: number = 100000; // how long to wait until client is "prepared" (after first sync)
  // TODO: decide where to save these constants
  private static readonly CURRENCY_KEY: string = 'currency';
  private static readonly LANGUAGE_KEY: string = 'language';
  private static readonly DEFAULT_CURRENCY: string = 'Euro';
  private static readonly DEFAULT_LANGUAGE: string = 'English';

  constructor() {}

  public async login(account: string, password: string): Promise<ServerResponse> {
    if (MatrixClientService.loggedIn) {
      return new UnsuccessfulResponse(ClientError.AlreadyLoggedIn).promise();
    }

    // Discover Homeserver Address and throw Errors if not successful
    const seperatedAccount = account.split(MatrixClientService.ACCOUNT_SEPARATOR);
    if (seperatedAccount.length != 2 || seperatedAccount[1] == '' || seperatedAccount[1] == undefined) {
      return new UnsuccessfulResponse(ClientError.UserIdFormat).promise();
    }
    const domain = seperatedAccount[1];

    // Discover base url and save it
    const config: DiscoveredClientConfig = await AutoDiscovery.findClientConfig(domain);
    const configState: string = config['m.homeserver']['state'];
    if (configState != MatrixClientService.AUTODISCOVERY_SUCCESS) {
      return new UnsuccessfulResponse(ClientError.Autodiscovery,
        config['m.homeserver']['error']).promise();
    }
    this.serverAddress = config['m.homeserver']['base_url'];

    // Create a Client
    this.matrixClient = await createClient(this.serverAddress);

    // Login and get Access Token
    this.accessToken = await this.matrixClient.loginWithPassword(account, password).catch((reason: string) => {
      return new UnsuccessfulResponse(ClientError.InvalidPassword, reason).promise();
    });
    MatrixClientService.loggedIn = true;

    // Start the Client (now in ObservableService)
    // this.matrixClient.startClient({initialSyncLimit: 8});

    // Set settings to default values if non existent
    const currencyEventContent = this.matrixClient.getAccountDataFromServer(MatrixClientService.CURRENCY_KEY); // content of the matrix event
    const languageEventContent = this.matrixClient.getAccountDataFromServer(MatrixClientService.LANGUAGE_KEY);

    if ((await currencyEventContent) == null) await this.matrixClient.setAccountData(MatrixClientService.CURRENCY_KEY,
      {'currency': MatrixClientService.DEFAULT_CURRENCY}); // TODO: find a way to avoid Magic number here
    if ((await languageEventContent) == null) await this.matrixClient.setAccountData(MatrixClientService.LANGUAGE_KEY,
      {'language': MatrixClientService.DEFAULT_LANGUAGE});

    // Sync for the first time and set loggedIn to true when ready
    this.matrixClient.once('sync', async (state, prevState, res) => {
      // state will be 'PREPARED' when the client is ready to use
      MatrixClientService.prepared = await (state === 'PREPARED' || state === 'SYNCING');
      console.log("prepared: " + MatrixClientService.prepared);
    });

    // move to the end of the method?
    // Call Observable Service
    // this.observableService.setUp();
    // this.matrixEmergentDataService.setClient(this.matrixClient);

    return new SuccessfulResponse();

    // TODO: Initialization of Data
  }

  public async logout(): Promise<ServerResponse> {
    if (MatrixClientService.loggedIn) {
      await this.matrixClient.logout();
      MatrixClientService.loggedIn = false;
      MatrixClientService.prepared = false;
      //this.observableService.tearDown();
      //this.matrixEmergentDataService.setClient(undefined);
    }

    // User was already logged out
    return new SuccessfulResponse();
  }

  public async getClient(): Promise<MatrixClient> {
    if (MatrixClientService.loggedIn == false) {
      throw new Error('can only get Client if logged in');
    } else if (this.matrixClient == undefined) {
      throw new Error('unknown error')
    }

    return this.matrixClient;
  }

  private static isLoggedIn(): boolean {
    return MatrixClientService.loggedIn;
  }

  public async getLoggedInClient(): Promise<MatrixClient> {
    if (MatrixClientService.loggedIn) return this.getClient();
    await MatrixClientService.until(MatrixClientService.isLoggedIn, 1000,
      MatrixClientService.TIMEOUT).catch(() => {return new UnsuccessfulResponse(3600000).promise();});
    return this.getClient();
  }

  private static isPrepared(): boolean {
    return MatrixClientService.prepared;
  }

  public async getPreparedClient(): Promise<MatrixClient> {
    const client: MatrixClient = await this.getClient();
    if (MatrixClientService.prepared) return client;
    await MatrixClientService.until(MatrixClientService.isPrepared, 1000,
      MatrixClientService.TIMEOUT).catch(() => {return new UnsuccessfulResponse(ClientError.Timeout).promise();});
    return this.getClient();
  }

  private static async until(condition: () => boolean, interval: number, timeout?: number): Promise<boolean> {
    let time: number = 0;
    while (condition() == false) {
      if (timeout != undefined && time >= timeout) return Promise.reject();
      await new Promise(resolve => setTimeout(resolve, interval));
      console.log("waiting for client to be logged in or prepared. " + time);
      time += interval;
    }
    return true;


    /*
        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }

        await sleep( 23000);
        console.log("Timer over");
    */

  }
}
