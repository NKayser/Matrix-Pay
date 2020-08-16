import {ServerResponse} from '../../ServerCommunication/Response/ServerResponse';
import {SuccessfulResponse} from '../../ServerCommunication/Response/SuccessfulResponse';

export class MockTransactionService{

  constructor() {
  }

  public async createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amounts: number[]):
    Promise<ServerResponse>{
    return new SuccessfulResponse();
  }


}
