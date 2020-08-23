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

  // Only defined if response failed.
  getMessage(): string {
    return "";
  }

  // Optional, can be of any type.
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
