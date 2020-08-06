import {ServerResponse} from "./ServerResponse";

export class SuccessfulResponse<T> extends ServerResponse {
  private value: T;

  public constructor(value?: T) {
    super();
    this.value = value;
  }

  getError(): any {
    return null;
  }

  getMessage(): string {
    return "";
  }

  getValue(): T {
    return this.value;
  }

  wasSuccessful(): boolean {
    return true;
  }

  promise(): Promise<ServerResponse> {
    return Promise.resolve(this);
  }
}
