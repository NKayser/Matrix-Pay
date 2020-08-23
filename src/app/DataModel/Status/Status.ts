import {ServerResponse} from '../../ServerCommunication/Response/ServerResponse';

/**
 * Status of the application holding server responses.
 */
export class Status {
  private _responses: ServerResponse[];

  /**
   * Constructor of Status. Initializes responses an an empty erray.
   */
  constructor() {
    this._responses = [];
  }

  /**
   * Returns an array holding server responses.
   */
  public get responses(): ServerResponse[] {
    return this._responses;
  }

  /**
   * Adds a new server response.
   * @param response  The server response that should be added.
   */
  public newResponse(response: ServerResponse): void { // TODO: OPTIONAL: sort Array maybe
    this.responses.push(response);
  }
}
