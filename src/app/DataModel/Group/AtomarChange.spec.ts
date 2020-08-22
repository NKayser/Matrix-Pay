import {AtomarChange} from './AtomarChange';
import {Contact} from './Contact';

describe('AtomarChange', () => {

  it('check values', () => {

    const c1 = new Contact('c1', 'Alice');
    const ac1 = new AtomarChange(c1, 5);

    expect(ac1.contact).toBe(c1);
    expect(ac1.amount).toEqual(5);


  });
});
