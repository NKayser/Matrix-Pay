import { MatrixClient } from 'matrix-js-sdk/src/client';
import { ServerResponse } from '../Response/ServerResponse';
import {EventEmitter} from '@angular/core';

export interface ClientInterface {
  login(account: string, password?: string, accessToken?: string): Promise<ServerResponse>;
  logout(): Promise<ServerResponse>;
  getClient(): MatrixClient;
  getRoomTypeClient(): MatrixClient;
  isPrepared(): boolean;
  isLoggedIn(): boolean;
  getLoggedInEmitter(): EventEmitter<void>; // returns an EventEmitter that emits if logged in
}
