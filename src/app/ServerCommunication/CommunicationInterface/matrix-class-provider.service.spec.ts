import { TestBed } from '@angular/core/testing';

import { MatrixClassProviderService } from './matrix-class-provider.service';

describe('MatrixClassProviderService', () => {
  let service: MatrixClassProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrixClassProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
