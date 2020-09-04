import { Injectable, EventEmitter } from '@angular/core';
// @ts-ignore
import {MatrixClient, IndexedDBStore} from 'matrix-js-sdk';

import { ServerResponse } from '../Response/ServerResponse';
import { ClientInterface } from './ClientInterface';
import {UnsuccessfulResponse} from '../Response/UnsuccessfulResponse';
import {SuccessfulResponse} from '../Response/SuccessfulResponse';
import {ClientError} from '../Response/ErrorTypes';
import {DiscoveredClientConfig} from '../../../matrix';
import {matrixCurrencyMap} from '../../DataModel/Utils/Currency';
import {MatrixClassProviderService} from './matrix-class-provider.service';

@Injectable({
  providedIn: 'root'
})
export class MatrixClientService implements ClientInterface {
  private matrixClient: MatrixClient;
  private serverAddress: string;
  private accessToken: string;
  private loggedIn: boolean = false;
  private prepared: boolean = false;
  private loggedInEmitter: EventEmitter<void>;

  private static readonly ACCOUNT_SEPARATOR: string = ':';
  private static readonly AUTODISCOVERY_SUCCESS: string = 'SUCCESS';
  private static readonly CURRENCY_KEY: string = 'com.matrixpay.currency';
  private static readonly LANGUAGE_KEY: string = 'com.matrixpay.language';
  private static readonly DEFAULT_CURRENCY: string = matrixCurrencyMap[0];
  private static readonly DEFAULT_LANGUAGE: string = 'English';

  // The MatrixClassProviderService encapsules global methods of the matrix-js-sdk, which is needed in this service.
  constructor(private matrixClassProviderService: MatrixClassProviderService) {
    this.loggedInEmitter = new EventEmitter();
  }

  public async login(account: string, password: string): Promise<ServerResponse> {
    if (this.loggedIn) throw new Error('already logged in');

    // Discover Homeserver Address and throw Errors if not successful
    const seperatedAccount = account.split(MatrixClientService.ACCOUNT_SEPARATOR);
    if (seperatedAccount.length != 2 || seperatedAccount[1] == '' || seperatedAccount[1] == undefined) {
      throw new Error('wrong user id format');
    }
    const domain = seperatedAccount[1];

    // Discover base url and save it
    const config: DiscoveredClientConfig = await this.matrixClassProviderService.findClientConfig(domain);
    const configState: string = config['m.homeserver']['state'];
    if (configState != MatrixClientService.AUTODISCOVERY_SUCCESS) {
      return new UnsuccessfulResponse(ClientError.Autodiscovery,
        config['m.homeserver']['error']);
    }
    this.serverAddress = config['m.homeserver']['base_url'];

    // Configure Client Store
    const opts = {
      localStorage: window.localStorage,
      indexedDB: window.indexedDB
    };
    const store = new IndexedDBStore(opts);
    await store.startup();

    // Create a Client
    this.matrixClient = await this.matrixClassProviderService.createClient(this.serverAddress, store);
    this.matrixClient.clearStores();

    // Login and get Access Token
    try {
      this.accessToken = await this.matrixClient.loginWithPassword(account, password);
      this.loggedIn = true;
    } catch(error) {
      this.loggedIn = false;
      const errorMsg: string = error['data']['errcode'] + ': ' + error['data']['error'];
      console.log(errorMsg);
      return new UnsuccessfulResponse(ClientError.InvalidPassword, errorMsg);
    }

    // Set settings to default values if non existent
    // First: get current settings, catch if not yet set
    let currencyEventContent;
    let languageEventContent;

    try {
      currencyEventContent = await this.matrixClient.getAccountDataFromServer(MatrixClientService.CURRENCY_KEY);
    } catch(error) {
      console.log('caught ' + error.message + ' while getting currency setting');
    }

    try {
      languageEventContent = await this.matrixClient.getAccountDataFromServer(MatrixClientService.LANGUAGE_KEY);
    } catch(error) {
      console.log('caught ' + error.message + ' while getting language setting');
    }

    console.log(currencyEventContent);

    // Secondly: Set default settings on AccountData if previously not set.
    if (currencyEventContent === null) await this.matrixClient.setAccountData(MatrixClientService.CURRENCY_KEY,
      {'currency': MatrixClientService.DEFAULT_CURRENCY});
    if (languageEventContent === null) await this.matrixClient.setAccountData(MatrixClientService.LANGUAGE_KEY,
      {'language': MatrixClientService.DEFAULT_LANGUAGE});

    // Set prepared to true when the Client state is prepared
    const listener = async (state, prevState, res) => {
      this.prepared = (state === "PREPARED" || state === "SYNCING");
      console.log("Matrix Client prepared: " + this.prepared);
      if (this.prepared) {
        this.matrixClient.removeListener("sync", listener);
      }
    }

    // Sync for the first time and set loggedIn to true when ready
    this.matrixClient.on('sync', listener);

    // Emit on the loggedInEmitter if logged in
    if (this.isLoggedIn()) {
      this.loggedInEmitter.emit();
    }

    return new SuccessfulResponse();
  }

  public getLoggedInEmitter(): EventEmitter<void> {
    return this.loggedInEmitter;
  }

  public async logout(): Promise<ServerResponse> {
    if (this.loggedIn) {
      await this.matrixClient.logout();
      this.loggedIn = false;
      this.prepared = false;
    }

    // User was already logged out
    return new SuccessfulResponse();
  }

  public getClient(): MatrixClient {
    if (this.loggedIn == false) {
      throw new Error('can only get Client if logged in');
    } else if (this.matrixClient == undefined) {
      throw new Error('unknown error')
    }

    return this.matrixClient;
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public isPrepared(): boolean {
    return this.prepared;
  }
}
