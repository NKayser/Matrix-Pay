import { TestBed } from '@angular/core/testing';

import { MatrixEmergentDataServiceService } from './matrix-emergent-data-service.service';

describe('MatrixEmergentDataServiceService', () => {
  let service: MatrixEmergentDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrixEmergentDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
