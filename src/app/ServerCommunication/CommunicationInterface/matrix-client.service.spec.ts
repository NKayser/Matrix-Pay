import { TestBed } from '@angular/core/testing';

import { MatrixClientService } from './matrix-client.service';

describe('MatrixClientServiceService', () => {
  let service: MatrixClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrixClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
