import {Currency} from '../Utils/Currency';
import {Contact} from '../Group/Contact';
import {User} from './User';
import {Language} from '../Utils/Language';

describe('User', () => {

  it('check values', () => {

    const c1 = new Contact('c1', 'Alice');
    const u1 = new User(c1, Currency.EUR, Language.GERMAN);

    expect(User.singleUser).toBe(u1);
    expect(u1.contact).toBe(c1);
    expect(u1.currency).toEqual(Currency.EUR);
    expect(u1.language).toEqual(Language.GERMAN);

  });

  it('change currency & language', () => {

    const c1 = new Contact('c1', 'Alice');
    const u1 = new User(c1, Currency.EUR, Language.GERMAN);

    expect(u1.currency).toEqual(Currency.EUR);
    expect(u1.language).toEqual(Language.GERMAN);
    u1.currency = Currency.USD;
    u1.language = Language.ENGLISH;
    expect(u1.currency).toEqual(Currency.USD);
    expect(u1.language).toEqual(Language.ENGLISH);

  });

  it('check groups', () => {

    const c1 = new Contact('c1', 'Alice');
    const u1 = new User(c1, Currency.EUR, Language.GERMAN);

    expect(u1.groups).toEqual([]);
    expect(u1.getGroup('g1')).toEqual(null);
    u1.createGroup('g1', 'name_g1', Currency.USD);
    expect(u1.getGroup('g1').name).toEqual('name_g1');

    u1.createGroup('g2', 'name_g2', Currency.EUR);
    expect(u1.groups.length).toBe(2);

    u1.removeGroup('g1');
    u1.removeGroup('g2');
    expect(u1.groups).toEqual([]);


  });
});
