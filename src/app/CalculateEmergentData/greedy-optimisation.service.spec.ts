import { TestBed } from '@angular/core/testing';

import { GreedyOptimisationService } from './greedy-optimisation.service';

describe('GreedyOptimisationService', () => {
  let service: GreedyOptimisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GreedyOptimisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
