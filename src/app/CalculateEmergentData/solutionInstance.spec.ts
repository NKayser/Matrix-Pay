import {ProblemInstance} from './problemInstance';
import {Groupmember} from '../DataModel/Group/Groupmember';
import {Contact} from '../DataModel/Group/Contact';
import {Group} from '../DataModel/Group/Group';
import {Currency} from '../DataModel/Utils/Currency';

describe('SolutionInstance', () => {

  it('should get values', () => {
    // Setup
    const group = new Group('groupId001', 'myGroup', Currency.USD);
    const member1 = new Groupmember(new Contact('contactId001', 'contact001'), group);
    const member2 = new Groupmember(new Contact('contactId002', 'contact002'), group);
    const member3 = new Groupmember(new Contact('contactId003', 'contact003'), group);
    member1.balance = 50;
    member2.balance = 60;
    member3.balance = 70;
    group.addGroupmember(member1);
    group.addGroupmember(member2);
    group.addGroupmember(member3);
    const problem = new ProblemInstance(group.groupmembers);

    // Actual
    expect(problem.getUsers()).toEqual(['contactId001', 'contactId002', 'contactId003']);
    expect(problem.getBalances()).toEqual([50, 60, 70]);
  });

  it('should get balances for users', () => {
    // Setup
    const group = new Group('groupId001', 'myGroup', Currency.USD);
    const member1 = new Groupmember(new Contact('contactId001', 'contact001'), group);
    const member2 = new Groupmember(new Contact('contactId002', 'contact002'), group);
    const member3 = new Groupmember(new Contact('contactId003', 'contact003'), group);
    member1.balance = 50;
    member2.balance = 60;
    member3.balance = 70;
    group.addGroupmember(member1);
    group.addGroupmember(member2);
    group.addGroupmember(member3);
    const problem = new ProblemInstance(group.groupmembers);

    // Actual
    expect(problem.getBalanceForUser(0)).toEqual(50);
    expect(problem.getBalanceForUser(1)).toEqual(60);
    expect(problem.getBalanceForUser(2)).toEqual(70);
  });
});
