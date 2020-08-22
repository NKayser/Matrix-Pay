import { TestBed } from '@angular/core/testing';

import { GreedyOptimisationService } from './greedy-optimisation.service';
import {ProblemInstance} from './problemInstance';
import {Groupmember} from '../DataModel/Group/Groupmember';
import {Contact} from '../DataModel/Group/Contact';
import {Group} from '../DataModel/Group/Group';
import {Currency} from '../DataModel/Utils/Currency';

describe('GreedyOptimisationService', () => {
  let service: GreedyOptimisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GreedyOptimisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate optimal solution with valid input', () => {
    const group = new Group('groupId001', 'myGroup', Currency.USD);
    const member1 = new Groupmember(new Contact('contactId001', 'contact001'), group);
    member1.balance = -6500;
    const member2 = new Groupmember(new Contact('contactId002', 'contact002'), group);
    member2.balance = -523;
    const member3 = new Groupmember(new Contact('contactId003', 'contact003'), group);
    member3.balance = 7023;
    const problem = new ProblemInstance([member1, member2, member3]);

     // Actual
    const solution = service.calculateOptimisation(problem);
    expect(solution.getPayerIds()).toEqual(['contactId001', 'contactId002']);
    expect(solution.getRecipientIds()).toEqual(['contactId003', 'contactId003']);
    expect(solution.getAmounts()).toEqual([6500, 523]);
  });

  it('should calculate optimal solution even if sum of balances is not 0', () => {
    const group = new Group('groupId001', 'myGroup', Currency.USD);
    const member1 = new Groupmember(new Contact('contactId001', 'contact001'), group);
    member1.balance = -6500;
    const member2 = new Groupmember(new Contact('contactId002', 'contact002'), group);
    member2.balance = -523;
    const member3 = new Groupmember(new Contact('contactId003', 'contact003'), group);
    member3.balance = 7013;
    const problem = new ProblemInstance([member1, member2, member3]);

    // Actual
    const solution = service.calculateOptimisation(problem);
    expect(solution.getPayerIds()).toEqual(['contactId001', 'contactId002']);
    expect(solution.getRecipientIds()).toEqual(['contactId003', 'contactId003']);
    expect(solution.getAmounts()).toEqual([6500, 513]);
  });
});
