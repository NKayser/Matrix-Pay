// @ts-ignore
import {MatrixError} from "matrix-js-sdk";

import {SuccessfulResponse} from "./SuccessfulResponse";
import {UnsuccessfulResponse} from "./UnsuccessfulResponse";

export abstract class ServerResponse {
  abstract wasSuccessful(): boolean;
  abstract getError(): any;
  abstract getMessage(): string;
  abstract getValue(): any;
  abstract promise(): Promise<ServerResponse>;
}
