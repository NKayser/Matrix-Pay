export class ServerResponse {
  private successful: boolean;
  private errorType: string;

  public static readonly UNKNOWN = 'unknown';
  public static readonly LOGGED_OUT: 'logged out';

  constructor(wasSuccessful: boolean, errorType?: string) {
    this.successful = wasSuccessful;
    this.errorType = errorType;
  }

  public wasSuccessful(): boolean {
    return this.successful;
  }

  public getErrorType(): string {
    if (this.wasSuccessful()) {
      return null;
    }

    return this.errorType;
  }
}
