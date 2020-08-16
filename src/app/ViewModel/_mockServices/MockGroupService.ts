import {ServerResponse} from '../../ServerCommunication/Response/ServerResponse';
import {SuccessfulResponse} from '../../ServerCommunication/Response/SuccessfulResponse';

export class MockGroupService{

  constructor() {
  }

  public async leaveGroup(groupId: string): Promise<ServerResponse>{
    return new SuccessfulResponse();
  }

  public async createGroup(name: string, currency: string, alias?: string, topic?: string): Promise<ServerResponse>{
    return new SuccessfulResponse();
  }

  public async addMember(groupId: string, userId: string): Promise<ServerResponse>{
    return new SuccessfulResponse();
  }

}
