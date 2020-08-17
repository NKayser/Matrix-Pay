import {User} from '../../DataModel/User/User';
import {Currency} from '../../DataModel/Utils/Currency';
import {Language} from '../../DataModel/Utils/Language';
import {Group} from '../../DataModel/Group/Group';
import {Recommendation} from '../../DataModel/Group/Recommendation';
import {Activity} from '../../DataModel/Group/Activity';
import {ActivityType} from '../../DataModel/Group/ActivityType';
import {AtomarChange} from '../../DataModel/Group/AtomarChange';
import {TransactionType} from '../../DataModel/Group/TransactionType';
import {Transaction} from '../../DataModel/Group/Transaction';
import {Groupmember} from '../../DataModel/Group/Groupmember';
import {Contact} from '../../DataModel/Group/Contact';

export class MockDataModelService {

  private readonly _user: User;
  private readonly _groups: Group[];

  constructor() {

      const c1 = new Contact('c1', 'Alice');
      this._user = new User(c1, Currency.EUR, Language.GERMAN);
      this._groups = [new Group('1', '1', Currency.USD), new Group('2', '2', Currency.EUR)];

      const c2 = new Contact('c2', 'Bob');
      const c3 = new Contact('c3', 'Eve');
      const testGroup = this._groups[0];
      const m2 = new Groupmember(c2, testGroup);
      const m3 = new Groupmember(c3, testGroup);
      const m1 = testGroup.groupmembers[0];
      m1.balance = 5;
      /*testGroup.addGroupmember(m2);
      testGroup.addGroupmember(m3);
      testGroup.addTransaction(new Transaction(TransactionType.EXPENSE, 't1', 't1', new Date(2020, 10, 5), testGroup,
      new AtomarChange(c1, 10), [new AtomarChange(c2, 10)], m1));
      testGroup.addTransaction(new Transaction(TransactionType.EXPENSE, 't2', 'another very long transaction name',

      new Date(2020, 10, 13), testGroup,
      new AtomarChange(c3, 15), [new AtomarChange(c2, 15)], m1));
      const r1 = new Recommendation(testGroup, new AtomarChange(c1, 10), new AtomarChange(c2, -10));
      const r2 = new Recommendation(testGroup, new AtomarChange(c3, 15), new AtomarChange(c1, -15));
      const r3 = new Recommendation(testGroup, new AtomarChange(c1, 10), new AtomarChange(c2, -10));
      const r4 = new Recommendation(testGroup, new AtomarChange(c3, 15), new AtomarChange(c1, -15));
      const r5 = new Recommendation(testGroup, new AtomarChange(c1, 10), new AtomarChange(c2, -10));
      const r6 = new Recommendation(testGroup, new AtomarChange(c3, 15), new AtomarChange(c1, -15));
      const r7 = new Recommendation(testGroup, new AtomarChange(c1, 10), new AtomarChange(c2, -10));
      const r8 = new Recommendation(testGroup, new AtomarChange(c3, 15), new AtomarChange(c1, -15));
      const r9 = new Recommendation(testGroup, new AtomarChange(c1, 10), new AtomarChange(c2, -10));
      const r10 = new Recommendation(testGroup, new AtomarChange(c3, 15), new AtomarChange(c1, -15));
      testGroup.setRecommendations([r1, r2, r2, r3, r4, r5, r6, r7, r8, r9, r10]);
      const a1 = new Activity(ActivityType.CONTACTLEFTGROUP, testGroup, c1, new Date());
      const a2 = new Activity(ActivityType.GROUPCREATION, testGroup, c1, new Date());
      const a3 = new Activity(ActivityType.NEWCONTACTINGROUP, testGroup, c1, new Date());
      const a4 = new Activity(ActivityType.NEWPAYBACK, testGroup, c1, new Date());
      testGroup.addActivity(a1);
      testGroup.addActivity(a2);
      testGroup.addActivity(a3);
      testGroup.addActivity(a4);*/

  }

  public getUser(): User{
    return this._user;
  }

  public getGroups(): Group[] {
    return this._groups;
  }
}
