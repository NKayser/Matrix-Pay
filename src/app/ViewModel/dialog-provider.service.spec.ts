import { TestBed } from '@angular/core/testing';

import { DialogProviderService } from './dialog-provider.service';

describe('DialogProviderService', () => {
  let service: DialogProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
