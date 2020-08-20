import {Contact} from './Contact';

describe('Contact', () => {

  it('check values', () => {

    const c1 = new Contact('c1', 'Alice');

    expect(c1.name).toEqual('Alice');
    expect(c1.contactId).toEqual('c1');

  });

  it('change name', () => {

    const c1 = new Contact('c1', 'Alice');

    expect(c1.name).toEqual('Alice');

    c1.name = 'Bob';

    expect(c1.name).toEqual('Bob');

  });
});
