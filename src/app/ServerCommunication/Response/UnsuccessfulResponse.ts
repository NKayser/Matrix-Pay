import {ServerResponse} from './ServerResponse';

export class UnsuccessfulResponse extends ServerResponse {
  private error: number;
  private message: string;

  public constructor(error?: number, message?: string) {
    super();
    this.error = error;
    this.message = message;
  }

  public getError(): number {
    return this.error;
  }

  public getMessage(): string {
    return this.message;
  }

  // Not defined because response unsuccessful.
  public getValue(): any {
    return null;
  }

  public wasSuccessful(): boolean {
    return false;
  }
}
