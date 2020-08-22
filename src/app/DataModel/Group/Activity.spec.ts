import {Activity} from './Activity';
import {ActivityType} from './ActivityType';
import {Group} from './Group';
import {Currency} from '../Utils/Currency';
import {Contact} from './Contact';

describe('Activity', () => {

  it('check values', () => {
    const g1 = new Group('g1', 'name_g1', Currency.EUR);
    const c1 = new Contact('c1', 'Alice');
    const d1 = new Date('December 17, 1995 03:24:00');
    const a1 = new Activity(ActivityType.CONTACTLEFTGROUP, g1, c1, d1);

    expect(a1.subject).toBe(g1);
    expect(a1.actor).toBe(c1);
    expect(a1.activityType).toEqual(ActivityType.CONTACTLEFTGROUP);
    expect(a1.creationDate).toBe(d1);

  });
});
