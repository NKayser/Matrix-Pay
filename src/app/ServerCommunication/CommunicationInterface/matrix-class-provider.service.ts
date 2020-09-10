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

  public createClient(serverAddress: string, store?: any, tokenObject?: any): Promise<MatrixClient> {
    let opts: string | any;

    if (tokenObject !== undefined && store !== undefined) {
      opts = {
        baseUrl: serverAddress,
        accessToken: tokenObject.accessToken,
        userId: tokenObject.account,
        store,
        useAutorizationHeader: true};
    } else if (tokenObject === undefined && store !== undefined) {
      opts = {
        baseUrl: serverAddress,
        store,
        useAutorizationHeader: true};
    } else if (tokenObject !== undefined && store === undefined) {
      opts = {
        baseUrl: serverAddress,
        accessToken: tokenObject.accessToken,
        userId: tokenObject.account,
        useAutorizationHeader: true};
    } else {
      opts = {
        serverAddress,
        useAutorizationHeader: true};
    }

    console.log(opts);

    // forwards call to createClient() method of the sdk
    return createClient(opts);
  }
}
