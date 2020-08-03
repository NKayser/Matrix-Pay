import { Injectable } from '@angular/core';
import { createClient } from 'matrix-js-sdk';
import { AutoDiscovery } from 'matrix-js-sdk/src/autodiscovery';
import { MatrixClient } from 'matrix-js-sdk/src/client';

import { ServerResponse } from '../Response/ServerResponse';
import { ClientInterface } from './ClientInterface';

@Injectable({
  providedIn: 'root'
})
export class MatrixClientService implements ClientInterface {
  private matrixClient: MatrixClient;
  private serverAddress: string;
  private accessToken: string;
  private loggedIn: boolean = false;

  private static readonly ACCOUNT_SEPARATOR = ':';
  private static readonly ERROR_AUTODISCOVERY = 'homeserver not discoverable from user_id. Reason: ';
  private static readonly ERROR_INVALID_ACCOUNT = 'user_id not in the right format';

  public login(account: string, password: string): ServerResponse {
    // Discover Homeserver Address and return an Error if not successful
    let autodiscovery = this.discoverServerAddress(account);
    if (!autodiscovery.wasSuccessful()) {
      return autodiscovery;
    }

    // Create a Client
    this.matrixClient = createClient(this.serverAddress);

    // Login and get Access Token
    this.matrixClient.login('m.login.password', {user: account, password})
      .then(response => this.accessToken = response.access_token,
            reason => {return new ServerResponse(false, reason)});

    // Start the Client, set loggedIn to true
    this.matrixClient.startClient();

    // TODO: call Observable Service

    // Sync for the first time and set loggedIn to true when ready
    this.matrixClient.once('sync', (state, prevState, res) => {
      this.loggedIn = (state === 'PREPARED'); // state will be 'PREPARED' when the client is ready to use
    });

    // TODO: Initialization of Data

    return new ServerResponse(true);
  }

  public logout(): ServerResponse {
    if (this.loggedIn) {
      this.matrixClient.logout();
      this.loggedIn = false;
    }

    // User was already logged out
    return new ServerResponse(true);
  }

  public getClient(): MatrixClient {
    if (this.loggedIn == false) {
      return new ServerResponse(false, ServerResponse.LOGGED_OUT)
    } else if (this.matrixClient == null) {
      return new ServerResponse(false, ServerResponse.UNKNOWN);
    }

    return this.matrixClient;
  }

  private discoverServerAddress(account: string): ServerResponse {
    // Discover Homeserver Address from account
    let autodiscovery = new AutoDiscovery();
    let seperatedAccount = account.split(MatrixClientService.ACCOUNT_SEPARATOR);

    if (seperatedAccount.length != 2) {
      return new ServerResponse(false, MatrixClient.ERROR_INVALID_ACCOUNT);
    }

    let domain = seperatedAccount[1];

    return ServerResponse.makeStandardRequest(autodiscovery.findClientConfig(domain),
      (val: string) => this.serverAddress = val,
      reason => MatrixClientService.ERROR_AUTODISCOVERY + reason);
  }
}
