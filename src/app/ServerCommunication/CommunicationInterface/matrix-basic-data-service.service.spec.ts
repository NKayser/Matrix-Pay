import { TestBed } from '@angular/core/testing';

import { MatrixBasicDataServiceService } from './matrix-basic-data-service.service';

describe('MatrixBasicDataServiceService', () => {
  let service: MatrixBasicDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrixBasicDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
