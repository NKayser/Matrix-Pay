import {ServerResponse} from '../../ServerCommunication/Response/ServerResponse';

export class Status {
  private _responses: ServerResponse[];

  public get responses(): ServerResponse[] {
    return this._responses;
  }

  public newResponse(response: ServerResponse): void { // TODO: OPTIONAL: sort Array maybe
    this.responses.push(response);
  }
}
