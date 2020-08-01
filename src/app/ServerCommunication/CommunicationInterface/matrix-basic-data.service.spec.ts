import { TestBed } from '@angular/core/testing';

import { MatrixBasicDataService } from './matrix-basic-data.service';

describe('MatrixBasicDataServiceService', () => {
  let service: MatrixBasicDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrixBasicDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
