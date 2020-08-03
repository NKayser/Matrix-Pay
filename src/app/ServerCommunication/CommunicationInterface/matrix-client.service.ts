import { Injectable } from '@angular/core';
import {createClient} from 'matrix-js-sdk';
import { MatrixClient } from 'matrix-js-sdk/src/client';

import axios, {AxiosResponse} from 'axios';

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

  public async login(account: string, password: string) {
    // Discover Homeserver Address and return an Error if not successful
    let seperatedAccount = account.split(MatrixClientService.ACCOUNT_SEPARATOR);

    if (seperatedAccount.length != 2) {
      return new ServerResponse(false, MatrixClientService.ERROR_INVALID_ACCOUNT);
    }

    let domain = seperatedAccount[1];
    let requestUrl: string = 'https://' + domain + '/.well-known/matrix/client';
    let json = await axios.get(requestUrl);
    this.serverAddress = json["data"]["m.homeserver"]["base_url"];

    console.log("Discovered: " + this.serverAddress);

    // TODO: use Auto discovery

    // Create a Client
    this.matrixClient = await createClient(this.serverAddress);

    // Login and get Access Token
    this.accessToken = await this.matrixClient.loginWithPassword(account, password);

    // Start the Client, set loggedIn to true
    this.matrixClient.startClient();

    // TODO: call Observable Service

    // Sync for the first time and set loggedIn to true when ready
    this.matrixClient.once('sync', (state, prevState, res) => {
      this.loggedIn = (state === 'PREPARED'); // state will be 'PREPARED' when the client is ready to use
      return new ServerResponse(true);
    });

    // TODO: Initialization of Data
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
}

interface DiscoveredClientConfig {
  "m.homeserver": {
    "base_url": string,
  },
  "m.identity_server": {
    "base_url": string,
  }
}
