import { Injectable } from '@angular/core';
// @ts-ignore
import {AutoDiscovery, MatrixClient, createClient} from "matrix-js-sdk";
import {DiscoveredClientConfig} from "../../../matrix";

@Injectable({
  providedIn: 'root'
})
export class MatrixClassProviderService {

  constructor() { }

  public findClientConfig(domain: string): Promise<DiscoveredClientConfig> {
    return AutoDiscovery.findClientConfig(domain);
  }

  public createClient(serverAddress: string): Promise<MatrixClient> {
    return createClient(serverAddress);
  }
}
