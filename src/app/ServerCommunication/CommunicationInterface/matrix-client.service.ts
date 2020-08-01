import { Injectable } from '@angular/core';
import {MatrixClient, AutoDiscovery, createClient} from 'matrix-js-sdk';
import { ServerResponse } from '../Response/ServerResponse';

@Injectable({
  providedIn: 'root'
})
export class MatrixClientService {
  private matrixClient: MatrixClient;
  private serverAddress: string;
  private accessToken: string;
  private loggedIn: boolean = false;

  private static readonly ACCOUNT_SEPARATOR = ':';

  login(account: string, password: string): ServerResponse {
    // Discover Homeserver Address from account
    let autodiscovery = new AutoDiscovery();
    let domain = account.split(MatrixClientService.ACCOUNT_SEPARATOR)[1];
    autodiscovery.findClientConfig(domain)
      .then((val) => {
        this.serverAddress = val;
      }).catch((reason) => {
        return ServerResponse(false, 'homeserver not discoverable from user_id. Reason: ' + reason);
      });

    // Create a Client
    this.matrixClient = createClient(this.serverAddress);

    // Login and get Access Token
    this.matrixClient.login('m.login.password', {user: account, password})
      .then((response) => {
        this.accessToken = response.access_token;
      })
      .catch((reason) => {
        return ServerResponse(false, reason);
      });

    // Start the Client, set loggedIn to true
    this.matrixClient.startClient();
    this.loggedIn = true;

    /*
    this.matrixClient.once('sync', (state, prevState, res) => {
      console.log(state); // state will be 'PREPARED' when the client is ready to use
      this.loggedIn = (state === 'PREPARED');
    });*/

    // TODO: Initialization of Data

    return ServerResponse(true);
  }

  public logout(): ServerResponse {
    if (this.loggedIn) {
      this.matrixClient.logout();
      return new ServerResponse(true);
    }

    // User was already logged out
    return new ServerResponse(true);
  }

  public getClient(): MatrixClient {
    if (this.matrixClient == null) {
      return new ServerResponse(false, 'not logged in yet');
    } else {
      return this.matrixClient;
    }
  }
}
