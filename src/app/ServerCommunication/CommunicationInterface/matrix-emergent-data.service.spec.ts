import { TestBed } from '@angular/core/testing';

import { MatrixEmergentDataService } from './matrix-emergent-data.service';

describe('MatrixEmergentDataServiceService', () => {
  let service: MatrixEmergentDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrixEmergentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
