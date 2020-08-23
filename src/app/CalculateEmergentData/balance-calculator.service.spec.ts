import {TestBed} from '@angular/core/testing';

import {BalanceCalculatorService} from './balance-calculator.service';
import {Group} from '../DataModel/Group/Group';
import {Currency} from '../DataModel/Utils/Currency';
import {Groupmember} from '../DataModel/Group/Groupmember';
import {Contact} from '../DataModel/Group/Contact';
import {Transaction} from '../DataModel/Group/Transaction';
import {TransactionType} from '../DataModel/Group/TransactionType';
import {AtomarChange} from '../DataModel/Group/AtomarChange';

describe('BalanceCalculatorService', () => {
  let service: BalanceCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BalanceCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate balances with valid input', () => {
    // Setup
    const group = new Group('groupId001', 'myGroup', Currency.USD);
    const member1 = new Groupmember(new Contact('contactId001', 'contact001'), group);
    const member2 = new Groupmember(new Contact('contactId002', 'contact002'), group);
    const member3 = new Groupmember(new Contact('contactId003', 'contact003'), group);
    group.addGroupmember(member1);
    group.addGroupmember(member2);
    group.addGroupmember(member3);
    const transaction1 = new Transaction(TransactionType.PAYBACK, 'transactionId001', 'transaction001', new Date(), group,
      new AtomarChange(member1.contact, 500), [new AtomarChange(member2.contact, 500)], member1);
    const transaction2 = new Transaction(TransactionType.EXPENSE, 'transactionId002', 'transaction002', new Date(), group,
      new AtomarChange(member3.contact, 7023), [new AtomarChange(member1.contact, 7000), new AtomarChange(member2.contact, 23)], member3);
    group.addTransaction(transaction1);
    group.addTransaction(transaction2);

    // Actual
    const solution = service.calculateBalances(group.groupmembers, [transaction1, transaction2]);
    expect(group.getGroupmember('contactId001').balance).toEqual(-6500);
    expect(group.getGroupmember('contactId002').balance).toEqual(-523);
    expect(group.getGroupmember('contactId003').balance).toEqual(7023);
    expect(solution.getUsers()).toEqual(['contactId001', 'contactId002', 'contactId003']);
    expect(solution.getBalances()).toEqual([-6500, -523, 7023]);
  });

  it('should calculate balances but only regard valid transactions that are actually for this group', () => {
    // Setup
    const group = new Group('groupId001', 'myGroup', Currency.USD);
    const otherGroup = new Group('groupId002', 'otherGroup', Currency.EUR);
    const member1 = new Groupmember(new Contact('contactId001', 'contact001'), group);
    const member2 = new Groupmember(new Contact('contactId002', 'contact002'), group);
    const member3 = new Groupmember(new Contact('contactId003', 'contact003'), group);
    group.addGroupmember(member1);
    group.addGroupmember(member2);
    group.addGroupmember(member3);
    const transaction1 = new Transaction(TransactionType.EXPENSE, 'transactionId001', 'transaction001', new Date(), group,
      new AtomarChange(member1.contact, 500), [new AtomarChange(member2.contact, 500)], member1);
    const transaction2 = new Transaction(TransactionType.PAYBACK, 'transactionId002', 'transaction002', new Date(), otherGroup,
      new AtomarChange(member3.contact, 7023), [new AtomarChange(member1.contact, 7000), new AtomarChange(member2.contact, 23)], member3);
    group.addTransaction(transaction1);
    group.addTransaction(transaction2);

    // Actual
    service.calculateBalances(group.groupmembers, [transaction1, transaction2]);
    expect(group.getGroupmember('contactId001').balance).toEqual(500);
    expect(group.getGroupmember('contactId002').balance).toEqual(-500);
    expect(group.getGroupmember('contactId003').balance).toEqual(0);
  });
});
