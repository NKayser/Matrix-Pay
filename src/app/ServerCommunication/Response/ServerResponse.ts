export class ServerResponse {
  private successful: boolean;
  private errorType: string;

  public static readonly UNKNOWN = 'unknown';
  public static readonly LOGGED_OUT: 'logged out';

  constructor(wasSuccessful: boolean, errorType?: string) {
    this.successful = wasSuccessful;
    this.errorType = errorType;

    if (!wasSuccessful) {
      console.log("Unsuccessful ServerResponse with Reason: " + errorType);
    }
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


  // not done !!!! Asynchronicity has not been resolved yet
  /**
   * Make a Request to the Server that gives back a promise, but return a synchronous ServerResponse and call the
   * callback functions.
   *
   * @param promise: The Promise given by the Request to the Server.
   * @param fulfilledCallback: Optional. To be executed when the promise made by the Server was fulfilled.
   * @param rejectedCallback: Optional. To be executed when the promise made by the Server was rejected.
   */
  public static async makeStandardRequest<T>(promise: Promise<T>,
                                       fulfilledCallback: (value: T) => void = (value: T) => {},
                                       rejectedCallback: (reason: string) => string = (reason: string) => reason) {
    promise.then(
      (value: T) => {
        fulfilledCallback(value);
        return new ServerResponse(true);
      },
      (reason: string) => {
        return new ServerResponse(false, rejectedCallback(reason));
      });
  }
}
