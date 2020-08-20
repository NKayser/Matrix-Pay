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
import {MatrixClassProviderService} from "../ServerUtils/matrix-class-provider.service";

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
  private static readonly TIMEOUT: number = 100000; // how long to wait until client is "prepared" (after first sync)
  // TODO: decide where to save these constants
  private static readonly CURRENCY_KEY: string = 'com.matrixpay.currency';
  private static readonly LANGUAGE_KEY: string = 'com.matrixpay.language';
  private static readonly DEFAULT_CURRENCY: string = matrixCurrencyMap[0];
  private static readonly DEFAULT_LANGUAGE: string = 'English';

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
        config['m.homeserver']['error']).promise();
    }
    this.serverAddress = config['m.homeserver']['base_url'];

    const opts = {
      localStorage: window.localStorage,
      indexedDB: window.indexedDB
    };
    const store = new IndexedDBStore(opts);
    await store.startup();

    // Create a Client
    this.matrixClient = await this.matrixClassProviderService.createClient(this.serverAddress, store);

    let response: ServerResponse;

    // Login and get Access Token
    this.accessToken = await this.matrixClient.loginWithPassword(account, password).then(
      () => {
        this.loggedIn = true;
        response = new SuccessfulResponse();
      },
      (reason: string) => {
        this.loggedIn = false;
        console.log(reason);
        response = new UnsuccessfulResponse(ClientError.InvalidPassword, reason);
      });

    if (await response instanceof UnsuccessfulResponse) return response;

    // Start the Client (now in ObservableService)
    // this.matrixClient.startClient({initialSyncLimit: 8});

    // Set settings to default values if non existent
    const currencyEventContent = await this.matrixClient.getAccountDataFromServer(MatrixClientService.CURRENCY_KEY).catch((err) => console.log('caught ' + err)); // content of the matrix event
    const languageEventContent = await this.matrixClient.getAccountDataFromServer(MatrixClientService.LANGUAGE_KEY).catch((err) => console.log('caught ' + err));

    console.log(currencyEventContent);

    if (currencyEventContent === null) await this.matrixClient.setAccountData(MatrixClientService.CURRENCY_KEY,
      {'com.matrixpay.currency': MatrixClientService.DEFAULT_CURRENCY}); // TODO: find a way to avoid Magic number here
    if (languageEventContent === null) await this.matrixClient.setAccountData(MatrixClientService.LANGUAGE_KEY,
      {'com.matrixpay.language': MatrixClientService.DEFAULT_LANGUAGE});


    const listener = async (state, prevState, res) => {
      this.prepared = (state === "PREPARED" || state === "SYNCING");
      console.log("Matrix Client prepared: " + this.prepared);
      if (this.prepared) {
        this.matrixClient.removeListener("sync", listener);
      }
    }

    // Sync for the first time and set loggedIn to true when ready
    this.matrixClient.on('sync', listener);

    // move to the end of the method?
    // Call Observable Service
    // this.observableService.setUp();
    // this.matrixEmergentDataService.setClient(this.matrixClient);

    const resp = await response;
    if (resp instanceof SuccessfulResponse) {
      this.loggedInEmitter.emit();
    }

    return resp;

    // TODO: Initialization of Data
  }

  public getLoggedInEmitter(): EventEmitter<void> {
    return this.loggedInEmitter;
  }

  public async logout(): Promise<ServerResponse> {
    if (this.loggedIn) {
      await this.matrixClient.logout();
      this.loggedIn = false;
      this.prepared = false;
      //this.observableService.tearDown();
      //this.matrixEmergentDataService.setClient(undefined);
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
