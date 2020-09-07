import { Injectable } from '@angular/core';
// @ts-ignore
import {AutoDiscovery, MatrixClient, createClient} from 'matrix-js-sdk';
import {DiscoveredClientConfig} from '../../../matrix';

@Injectable({
  providedIn: 'root'
})
export class MatrixClassProviderService {

  constructor() { }

  public findClientConfig(domain: string): Promise<DiscoveredClientConfig> {
    // Use AutoDiscovery Class from matrix-js-sdk to discover the homeserver address
    // so the User doesn't need to provide it at login.
    return AutoDiscovery.findClientConfig(domain);
  }

  public createClient(serverAddress: string, store?: any): Promise<MatrixClient> {
    if (store === undefined) {
      return createClient(serverAddress);
    }

    // forwards call to createClient() method of the sdk
    return createClient({
      store: store,
      baseUrl: serverAddress
    });
  }
}
