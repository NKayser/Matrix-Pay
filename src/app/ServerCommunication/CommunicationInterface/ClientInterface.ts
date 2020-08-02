import { MatrixClient } from 'matrix-js-sdk';
import { ServerResponse } from '../Response/ServerResponse';

export interface ClientInterface {
  login(account: string, /*serverAddress: string,*/ password: string): ServerResponse;
  logout(): ServerResponse;
  getClient(): MatrixClient;
}
