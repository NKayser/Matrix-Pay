import { Injectable, EventEmitter } from '@angular/core';
// @ts-ignore
import {MatrixClient, IndexedDBStore, MatrixError} from 'matrix-js-sdk';

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
  private roomTypeMatrixClient: MatrixClient;
  private serverAddress: string;
  private loginInfo: any;
  private loggedIn: boolean = false;
  private prepared: boolean = false;
  private loggedInEmitter: EventEmitter<void>;
  private logoutEmitter: EventEmitter<void>;

  private static readonly ACCOUNT_SEPARATOR: string = ':';
  private static readonly AUTODISCOVERY_SUCCESS: string = 'SUCCESS';
  private static readonly CURRENCY_KEY: string = 'com.matrixpay.currency';
  private static readonly LANGUAGE_KEY: string = 'com.matrixpay.language';
  private static readonly DEFAULT_CURRENCY: string = matrixCurrencyMap[0];
  private static readonly DEFAULT_LANGUAGE: string = 'English';

  // The MatrixClassProviderService encapsules global methods of the matrix-js-sdk, which is needed in this service.
  constructor(private matrixClassProviderService: MatrixClassProviderService) {
    this.loggedInEmitter = new EventEmitter();
    this.logoutEmitter = new EventEmitter();
  }

  // to login with accessToken, call: await login('@user:url', undefined, 'accessToken');
  // accessToken will be saved in localStorage under key 'accessToken'.
  public async login(account: string, password?: string, accessToken?: string): Promise<ServerResponse> {
    if (this.loggedIn) throw new Error('already logged in');

    // Discover Homeserver Address
    const autodiscoveryResponse = await this.autodiscovery(account);
    if (autodiscoveryResponse instanceof UnsuccessfulResponse) return autodiscoveryResponse;

    // Create Client, Login and set Access Token
    try {
      await this.authenticate(account, password, accessToken);
    } catch(error) {
      console.log(error);
      this.loggedIn = false;
      let errorMsg: string;
      if (typeof(error) === 'string') {
        errorMsg = error;
      } else {
        errorMsg = error['data']['errcode'] + ': ' + error['data']['error'];
      }

      return new UnsuccessfulResponse(ClientError.InvalidPassword, errorMsg);
    }

    // Set settings to default values if non existent
    await this.setDefaultSettings();

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

  private async autodiscovery(account: string): Promise<null | ServerResponse> {
    const savedAddress = localStorage.getItem('baseUrl');
    if (savedAddress !== null) {
      this.serverAddress = savedAddress;
      return;
    }

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
      console.log(config);
      return new UnsuccessfulResponse(ClientError.Autodiscovery,
        config['m.homeserver']['error']);
    }
    this.serverAddress = config['m.homeserver']['base_url'];
    localStorage.setItem('baseUrl', this.serverAddress);
  }

  private async authenticate(account: string, password?: string, accessToken?: string): Promise<void> {
    if (password === undefined) {
      // Login with given access token (if given)
      if (accessToken === undefined) {
        return Promise.reject('No authentification data provided. Need either account/pw or accessToken.');
      }

      // Create Client AND Login
      this.matrixClient = await this.matrixClassProviderService.createClient(this.serverAddress, undefined,
        {accessToken, account});
      this.roomTypeMatrixClient = await this.matrixClassProviderService.createClient(this.serverAddress, undefined,
        {accessToken, account});
      this.loginInfo = {access_token: accessToken};
    } else {
      // Login with Account/pw
      if (account === undefined) {
        return Promise.reject('No authentification data provided. Need account, not only password.');
      }

      // Just Create Client
      this.matrixClient = await this.matrixClassProviderService.createClient(this.serverAddress);
      this.roomTypeMatrixClient = await this.matrixClassProviderService.createClient(this.serverAddress);

      // Now Login
      this.loginInfo = await this.matrixClient.loginWithPassword(account, password);
      await this.roomTypeMatrixClient.loginWithPassword(account, password);

      localStorage.setItem('accessToken', this.loginInfo.access_token);
      localStorage.setItem('account', account);
    }

    // Login successful
    console.log('token written');
    console.log(this.loginInfo);
    this.loggedIn = true;
  }

  private async setDefaultSettings(): Promise<void> {
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
  }

  public getLoggedInEmitter(): EventEmitter<void> {
    return this.loggedInEmitter;
  }

  public getLogoutEmitter(): EventEmitter<void> {
    return this.logoutEmitter;
  }

  public async logout(): Promise<ServerResponse> {
    if (this.loggedIn) {
      await this.matrixClient.logout();
      this.loggedIn = false;
      this.prepared = false;
    }

    // Clear local storage and reset access token
    localStorage.clear();
    this.loginInfo = undefined;

    this.logoutEmitter.emit();

    // User was already logged out
    return new SuccessfulResponse();
  }

  public getClient(): MatrixClient {
    if (this.loggedIn == false) {
      throw new Error('can only get Client if logged in');
    } else if (this.matrixClient === undefined) {
      throw new Error('unknown error');
    }

    return this.matrixClient;
  }

  public getRoomTypeClient(): MatrixClient {
    if (this.loggedIn === false) {
      throw new Error('can only get Client if logged in');
    } else if (this.matrixClient === undefined) {
      throw new Error('unknown error');
    }

    return this.roomTypeMatrixClient;
  }

  public async getNewClient(): MatrixClient {
    // TODO: handle failed client creation
    const tokenObj = {accessToken: localStorage.getItem('accessToken'), account: localStorage.getItem('account')};
    console.log(tokenObj);
    return await this.matrixClassProviderService.createClient(this.serverAddress, undefined, tokenObj);
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public isPrepared(): boolean {
    return this.prepared;
  }
}
