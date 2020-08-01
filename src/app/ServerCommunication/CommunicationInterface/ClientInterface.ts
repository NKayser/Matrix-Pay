import { MatrixClient } from 'matrix-js-sdk';

interface ClientInterface {
  login(account: string, /*serverAddress: string,*/ password: string): Response;
  logout(): Response;
  getClient(): MatrixClient;
}
