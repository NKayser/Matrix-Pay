import {Group} from './Group';
import {Currency} from '../Utils/Currency';
import {Contact} from './Contact';
import {Groupmember} from './Groupmember';

describe('Groupmember', () => {

  it('check values', () => {
    const g1 = new Group('g1', 'name_g1', Currency.EUR);
    const c1 = new Contact('c1', 'Alice');
    const gm1 = new Groupmember(c1, g1);

    expect(gm1.balance).toBe(0);
    expect(gm1.contact).toBe(c1);
    expect(gm1.group).toBe(g1);
  });

  it('check balances', () => {
    const g1 = new Group('g1', 'name_g1', Currency.EUR);
    const c1 = new Contact('c1', 'Alice');
    const gm1 = new Groupmember(c1, g1);

    expect(gm1.balance).toBe(0);
    gm1.balance = 42;
    expect(gm1.balance).toBe(42);
  });
});
