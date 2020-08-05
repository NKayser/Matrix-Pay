import { Injectable } from '@angular/core';
// @ts-ignore
import {createClient, MatrixClient, AutoDiscovery} from 'matrix-js-sdk';

import { ServerResponse } from '../Response/ServerResponse';
import { ClientInterface } from './ClientInterface';
import {ObservableService} from './observable.service';
import {UnsuccessfulResponse} from '../Response/UnsuccessfulResponse';
import {SuccessfulResponse} from '../Response/SuccessfulResponse';
import {LoginErrorType} from '../Response/ErrorTypes';
import {DiscoveredClientConfig} from '../../../matrix';

@Injectable({
  providedIn: 'root'
})
export class MatrixClientService implements ClientInterface {
  private matrixClient: MatrixClient;
  private serverAddress: string;
  private accessToken: string;
  private loggedIn: boolean = false;

  private static readonly ACCOUNT_SEPARATOR: string = ':';
  private static readonly AUTODISCOVERY_SUCCESS: string = 'SUCCESS';

  public async login(account: string, password: string): Promise<ServerResponse> {
    if (this.loggedIn) {
      return new UnsuccessfulResponse(LoginErrorType.AlreadyLoggedIn).promise();
    }

    // Discover Homeserver Address and throw Errors if not successful
    const seperatedAccount = account.split(MatrixClientService.ACCOUNT_SEPARATOR);
    if (seperatedAccount.length != 2 || seperatedAccount[1] == '' || seperatedAccount[1] == undefined) {
      return new UnsuccessfulResponse(LoginErrorType.UserIdFormat).promise();
    }
    const domain = seperatedAccount[1];

    // Discover base url and save it
    const config: DiscoveredClientConfig = await AutoDiscovery.findClientConfig(domain);
    const configState: string = config['m.homeserver']['state'];
    if (configState != MatrixClientService.AUTODISCOVERY_SUCCESS) {
      return new UnsuccessfulResponse(LoginErrorType.Autodiscovery,
        config['m.homeserver']['error']).promise();
    }
    this.serverAddress = config['m.homeserver']['base_url'];

    // Create a Client
    this.matrixClient = await createClient(this.serverAddress);

    // Login and get Access Token
    this.accessToken = await this.matrixClient.loginWithPassword(account, password).catch((reason: string) => {
      return new UnsuccessfulResponse(LoginErrorType.InvalidPassword, reason).promise();
    });

    // Start the Client
    this.matrixClient.startClient();

    // Call Observable Service
    new ObservableService();

    // Sync for the first time and set loggedIn to true when ready
    this.matrixClient.once('sync', (state, prevState, res) => {
      this.loggedIn = (state === 'PREPARED'); // state will be 'PREPARED' when the client is ready to use
      return new SuccessfulResponse();
    });

    // TODO: Initialization of Data
  }

  public async logout(): Promise<ServerResponse> {
    if (this.loggedIn) {
      await this.matrixClient.logout();
      this.loggedIn = false;
    }

    // User was already logged out
    return new SuccessfulResponse();
  }

  public getClient(): MatrixClient {
    if (this.loggedIn == false) {
      throw new Error('can only get Client if logged in');
    } else if (this.matrixClient == null) {
      throw new Error('logged in, but Client not set yet for unknown reason')
    }

    return this.matrixClient;
  }
}
