import {Group} from './Group';
import {Currency} from '../Utils/Currency';
import {Contact} from './Contact';
import {Groupmember} from './Groupmember';
import {Activity} from './Activity';
import {Transaction} from './Transaction';
import {TransactionType} from './TransactionType';
import {AtomarChange} from './AtomarChange';
import {ActivityType} from './ActivityType';
import {Recommendation} from './Recommendation';

describe('Group', () => {

  it('check values', () => {

    const g1 = new Group('g1', 'name_g1', Currency.EUR);

    expect(g1.name).toEqual('name_g1');
    expect(g1.groupId).toEqual('g1');
    expect(g1.currency).toEqual(Currency.EUR);

  });

  it('check groupmembers', () => {

    const g1 = new Group('g1', 'name_g1', Currency.EUR);
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const gm1 = new Groupmember(c1, g1);
    const gm2 = new Groupmember(c2, g1);
    const gm3 = new Groupmember(c2, g1);

    expect(g1.groupmembers).toEqual([]);
    g1.addGroupmember(gm1);
    g1.addGroupmember(gm2);
    expect(g1.groupmembers).toEqual([gm1, gm2]);
    g1.addGroupmember(gm3);
    expect(g1.groupmembers).toEqual([gm1, gm2, gm3]);
    // g1.addGroupmember(gm1);
    // expect(g1.groupmembers).toEqual([gm1, gm2, gm3]);
    g1.removeGroupmember('c1');
    expect(g1.groupmembers).toEqual([gm2, gm3]);
    g1.addGroupmember(gm1);
    expect(g1.groupmembers).toEqual([gm2, gm3, gm1]);

    expect(g1.getGroupmember('c1')).toBe(gm1);
  });

  it('check activities', () => {

    const g1 = new Group('g1', 'name_g1', Currency.EUR);
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const c3 = new Contact('c3', 'Eve');
    const d1 = new Date('December 17, 1995 03:24:00');
    const d2 = new Date('December 18, 1995 03:24:00');
    const d3 = new Date('December 19, 1995 03:24:00');
    const gm1 = new Groupmember(c1, g1);
    const t1 = new Transaction(TransactionType.EXPENSE, 't1', 'name_t1', d1, g1, new AtomarChange(c1, 5),
      [new AtomarChange(c2, -5)], gm1);

    const a1 = new Activity(ActivityType.NEWEXPENSE, t1, c1, d1);
    const a2 = new Activity(ActivityType.CONTACTLEFTGROUP, g1, c2, d2);
    const a3 = new Activity(ActivityType.NEWCONTACTINGROUP, g1, c3, d3);

    expect(g1.activities).toEqual([]);
    g1.addActivity(a1);
    expect(g1.activities).toEqual([a1]);
    g1.addActivity(a2);
    expect(g1.activities).toEqual([a1, a2]);
    g1.addActivity(a3);
    expect(g1.activities).toEqual([a1, a2, a3]);
  });

  it('check recommendations', () => {

    const g1 = new Group('g1', 'name_g1', Currency.EUR);
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const c3 = new Contact('c3', 'Eve');
    const r1 = new Recommendation(g1, new AtomarChange(c1, 10), new AtomarChange(c2, -10));
    const r2 = new Recommendation(g1, new AtomarChange(c3, 15), new AtomarChange(c2, -15));

    expect(g1.recommendations).toEqual([]);
    g1.setRecommendations([r1, r2]);
    expect(g1.recommendations).toEqual([r1, r2]);
    g1.deleteRecommendation('c1', 'c2');
    expect(g1.recommendations).toEqual([r2]);
  });

  it('check transactions', () => {

    const g1 = new Group('g1', 'name_g1', Currency.EUR);
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const c3 = new Contact('c3', 'Eve');

    const d1 = new Date('December 17, 1995 03:24:00');
    const d2 = new Date('December 18, 1995 03:24:00');
    const gm1 = new Groupmember(c1, g1);
    const t1 = new Transaction(TransactionType.EXPENSE, 't1', 'name_t1', d1, g1, new AtomarChange(c1, 20),
      [new AtomarChange(c2, -15), new AtomarChange(c3, -5)], gm1);
    const t2 = new Transaction(TransactionType.PAYBACK, 't2', 'name_t2', d2, g1, new AtomarChange(c3, 5),
      [new AtomarChange(c2, -5)], gm1);

    expect(g1.transactions).toEqual([]);
    g1.addTransaction(t1);
    expect(g1.transactions).toEqual([t1]);
    g1.addTransaction(t2);
    expect(g1.transactions).toEqual([t1, t2]);

    g1.editTransaction('t1', 'name_new_t1', new AtomarChange(c1, 25),
      [new AtomarChange(c2, -15), new AtomarChange(c3, -10)]);

    expect(g1.getTransaction('t1').name).toEqual('name_new_t1');

  });




});
