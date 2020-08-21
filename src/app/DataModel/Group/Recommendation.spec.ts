import {Contact} from './Contact';
import {Recommendation} from './Recommendation';
import {AtomarChange} from './AtomarChange';
import {Group} from './Group';
import {Currency} from '../Utils/Currency';

describe('Recommendation', () => {

  it('check values', () => {
    const g1 = new Group('g1', 'name_g1', Currency.EUR);
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const am1 = new AtomarChange(c1, 10);
    const am2 = new AtomarChange(c2, -10);
    const r1 = new Recommendation(g1, am1, am2);

    expect(r1.payer).toBe(am1);
    expect(r1.recipient).toBe(am2);
    expect(r1.group).toBe(g1);

  });
});
