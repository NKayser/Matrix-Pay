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

  public async userChangeLanguage(language: string): Promise<ServerResponse>{
    return new SuccessfulResponse();
  }

  public async userChangeDefaultCurrency(currency: string): Promise<ServerResponse>{
    return new SuccessfulResponse();
  }

  public async leaveGroup(groupId: string): Promise<ServerResponse>{
    return new SuccessfulResponse();
  }

  public async groupCreate(name: string, currency: string): Promise<ServerResponse>{
    return new SuccessfulResponse();
  }

  public async groupAddMember(groupId: string, userId: string): Promise<ServerResponse>{
    return new SuccessfulResponse();
  }

  public async createTransaction(groupId: string, description: string, payerId: string, recipientIds: string[], amounts: number[]):
    Promise<ServerResponse>{
    return new SuccessfulResponse();
  }


}
