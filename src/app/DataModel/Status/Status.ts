export class Status {
  private _responses: Response[];

  public get responses(): Response[] {
    return this._responses;
  }

  public newResponse(response: Response): void { // TODO: OPTIONAL: sort Array maybe
    this.responses.push(response);
  }
}
