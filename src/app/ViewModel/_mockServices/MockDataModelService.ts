import {User} from '../../DataModel/User/User';
import {Currency} from '../../DataModel/Utils/Currency';
import {Language} from '../../DataModel/Utils/Language';
import {Group} from '../../DataModel/Group/Group';

export class MockDataModelService {

  private _user: User = new User(null, Currency.EUR, Language.GERMAN);

  constructor() {
  }

  public getUser(): User{
    return this._user;
  }

  public getGroups(): Group[] {
    return [new Group('1', '1', Currency.USD), new Group('2', '2', Currency.EUR)];
  }
}
