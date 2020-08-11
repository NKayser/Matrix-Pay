import {SuccessfulResponse} from "./SuccessfulResponse";
// @ts-ignore
import {MatrixError} from "matrix-js-sdk";
import {UnsuccessfulResponse} from "./UnsuccessfulResponse";
import {ServerResponse} from "./ServerResponse";

export class Utils {
  public static readonly log: boolean = false;

  public static async makeStandardRequest<T>(request: () => Promise<T>,
      errorMapping: (errCode: string) => number): Promise<ServerResponse> {
      let response: ServerResponse;
    request().then((val: T) => {
        // on fulfilled
        response = new SuccessfulResponse(val);
      },
      (err: MatrixError) => {
        // on rejected
        const errCode: number = errorMapping(err['data']['errcode']);
        const errMessage: string = err['data']['error'];
        response = new UnsuccessfulResponse(errCode, errMessage);
      });

    return await response;
  }
}
