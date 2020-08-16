import {ServerResponse} from '../../ServerCommunication/Response/ServerResponse';
import {SuccessfulResponse} from '../../ServerCommunication/Response/SuccessfulResponse';

export class MockSettingsService{

  constructor() {
  }

  public async changeLanguage(language: string): Promise<ServerResponse>{
    return new SuccessfulResponse();
  }

  public async changeCurrency(currency: string): Promise<ServerResponse>{
    return new SuccessfulResponse();
  }

}
