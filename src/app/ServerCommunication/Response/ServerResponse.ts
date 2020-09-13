export abstract class ServerResponse {
  abstract wasSuccessful(): boolean;
  abstract getError(): number;
  abstract getMessage(): string;
  abstract getValue(): any;
}
