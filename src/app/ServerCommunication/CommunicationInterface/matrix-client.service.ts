import { Injectable } from '@angular/core';
// @ts-ignore
import {createClient, MatrixClient, AutoDiscovery} from 'matrix-js-sdk';

import { ServerResponse } from '../Response/ServerResponse';
import { ClientInterface } from './ClientInterface';
import {ObservableService} from './observable.service';
import {UnsuccessfulResponse} from '../Response/UnsuccessfulResponse';
import {SuccessfulResponse} from '../Response/SuccessfulResponse';
import {LoginError} from '../Response/ErrorTypes';
import {DiscoveredClientConfig} from '../../../matrix';

@Injectable({
  providedIn: 'root'
})
export class MatrixClientService implements ClientInterface {
  private matrixClient: MatrixClient;
  private serverAddress: string;
  private accessToken: string;
  private loggedIn: boolean = false;
  private prepared: boolean;

  private static readonly ACCOUNT_SEPARATOR: string = ':';
  private static readonly AUTODISCOVERY_SUCCESS: string = 'SUCCESS';

  public async login(account: string, password: string): Promise<ServerResponse> {
    if (this.loggedIn) {
      return new UnsuccessfulResponse(LoginError.AlreadyLoggedIn).promise();
    }

    // Discover Homeserver Address and throw Errors if not successful
    const seperatedAccount = account.split(MatrixClientService.ACCOUNT_SEPARATOR);
    if (seperatedAccount.length != 2 || seperatedAccount[1] == '' || seperatedAccount[1] == undefined) {
      return new UnsuccessfulResponse(LoginError.UserIdFormat).promise();
    }
    const domain = seperatedAccount[1];

    // Discover base url and save it
    const config: DiscoveredClientConfig = await AutoDiscovery.findClientConfig(domain);
    const configState: string = config['m.homeserver']['state'];
    if (configState != MatrixClientService.AUTODISCOVERY_SUCCESS) {
      return new UnsuccessfulResponse(LoginError.Autodiscovery,
        config['m.homeserver']['error']).promise();
    }
    this.serverAddress = config['m.homeserver']['base_url'];

    // Create a Client
    this.matrixClient = await createClient(this.serverAddress);

    // Login and get Access Token
    this.accessToken = await this.matrixClient.loginWithPassword(account, password).catch((reason: string) => {
      return new UnsuccessfulResponse(LoginError.InvalidPassword, reason).promise();
    });
    this.loggedIn = true;

    // Start the Client
    this.matrixClient.startClient();

    // Call Observable Service
    new ObservableService(this);

    // Sync for the first time and set loggedIn to true when ready
    this.matrixClient.once('sync', async (state, prevState, res) => {
      // state will be 'PREPARED' when the client is ready to use
      this.prepared = await (state === 'PREPARED' || state === 'SYNCING');
      console.log("prepared: " + this.prepared);
      //return new SuccessfulResponse();
    });
/*
    if (this.matrixClient.isInitialSyncComplete()) {
      this.prepared = true;
      console.log("prepared: " + this.prepared);
      return new SuccessfulResponse();
    }
*/
    return new SuccessfulResponse();

    // TODO: Initialization of Data
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

  public async getClient(): Promise<MatrixClient> {
    if (this.loggedIn == false) {
      throw new Error('can only get Client if logged in');
    } else if (this.matrixClient == undefined) {
      throw new Error('unknown error')
    }
    /*
        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }

        await sleep( 5000);
        console.log("Timer over");
    */

    /*
    if (!this.prepared) {
      this.matrixClient.once('sync', (state, prevState, res) => {
        if (state === 'PREPARED') { // state will be 'PREPARED' when the client is ready to use
          return this.matrixClient;
        }
      });
    } else {
      return this.matrixClient;
    }*/
    return this.matrixClient;
  }
}
