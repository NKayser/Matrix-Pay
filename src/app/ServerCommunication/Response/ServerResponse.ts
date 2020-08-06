export abstract class ServerResponse {
  abstract wasSuccessful(): boolean;
  abstract getError(): any;
  abstract getMessage(): string;
  abstract getValue(): any;
  abstract promise(): Promise<ServerResponse>;
}
