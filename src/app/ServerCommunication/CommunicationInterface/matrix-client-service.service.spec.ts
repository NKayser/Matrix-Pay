import { TestBed } from '@angular/core/testing';

import { MatrixClientServiceService } from './matrix-client-service.service';

describe('MatrixClientServiceService', () => {
  let service: MatrixClientServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrixClientServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
