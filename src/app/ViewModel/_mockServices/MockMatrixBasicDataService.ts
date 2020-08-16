import {SuccessfulResponse} from '../../ServerCommunication/Response/SuccessfulResponse';
import {ServerResponse} from '../../ServerCommunication/Response/ServerResponse';

export class MockMatrixBasicDataService{

  constructor() {
  }

  public confirmPayback(groupId: string, recommendationId: number): Promise<ServerResponse>{
    return this.dummy();
  }

  private async dummy(): Promise<ServerResponse>{
    return new SuccessfulResponse();
  }


}
