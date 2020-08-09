import { MatrixClient } from 'matrix-js-sdk/src/client';
import { ServerResponse } from '../Response/ServerResponse';

export interface ClientInterface {
  login(account: string, password: string): Promise<ServerResponse>;
  logout(): Promise<ServerResponse>;
  getClient(): Promise<MatrixClient>;
  getPreparedClient(): Promise<MatrixClient>;
}
