import {Group} from './Group';
import {Currency} from '../Utils/Currency';
import {Contact} from './Contact';
import {Groupmember} from './Groupmember';
import {Transaction} from './Transaction';
import {TransactionType} from './TransactionType';
import {AtomarChange} from './AtomarChange';

describe('Transaction', () => {

  it('check values', () => {
    const g1 = new Group('g1', 'name_g1', Currency.EUR);
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const c3 = new Contact('c3', 'Eve');
    const d1 = new Date('December 17, 1995 03:24:00');
    const gm1 = new Groupmember(c1, g1);
    const am1 = new AtomarChange(c1, 20);
    const am2 = new AtomarChange(c2, -15);
    const am3 = new AtomarChange(c3, -5);
    const t1 = new Transaction(TransactionType.EXPENSE, 't1', 'name_t1', d1, g1, am1, [am2, am3], gm1);

    expect(t1.name).toEqual('name_t1');
    expect(t1.transactionId).toEqual('t1');
    expect(t1.group).toBe(g1);
    expect(t1.payer).toBe(am1);
    expect(t1.recipients).toEqual([am2, am3]);
    expect(t1.transactionType).toEqual(TransactionType.EXPENSE);
    expect(t1.creationDate).toEqual(d1);
    expect(t1.sender).toBe(gm1);
  });

  it('check name change', () => {
    const g1 = new Group('g1', 'name_g1', Currency.EUR);
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const c3 = new Contact('c3', 'Eve');
    const d1 = new Date('December 17, 1995 03:24:00');
    const gm1 = new Groupmember(c1, g1);
    const am1 = new AtomarChange(c1, 20);
    const am2 = new AtomarChange(c2, -15);
    const am3 = new AtomarChange(c3, -5);
    const t1 = new Transaction(TransactionType.EXPENSE, 't1', 'name_t1', d1, g1, am1, [am2, am3], gm1);


    expect(t1.name).toEqual('name_t1');
    t1.name = 't1_new_name';
    expect(t1.name).toEqual('t1_new_name');
  });

  it('check payer & recipient change', () => {

    const g1 = new Group('g1', 'name_g1', Currency.EUR);
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const c3 = new Contact('c3', 'Eve');
    const d1 = new Date('December 17, 1995 03:24:00');
    const gm1 = new Groupmember(c1, g1);
    const am1 = new AtomarChange(c1, 20);
    const am2 = new AtomarChange(c2, -15);
    const am3 = new AtomarChange(c3, -5);
    const t1 = new Transaction(TransactionType.EXPENSE, 't1', 'name_t1', d1, g1, am1, [am2, am3], gm1);


    expect(t1.payer).toEqual(am1);
    const am4 = new AtomarChange(c1, 35);
    const am5 = new AtomarChange(c2, -35);
    t1.payer = am4;
    t1.recipients = [am5];
    expect(t1.payer).toBe(am4);
    expect(t1.recipients).toEqual([am5]);
  });
});
