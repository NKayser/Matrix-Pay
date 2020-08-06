import { TestBed } from '@angular/core/testing';

import { EmergentDataUpdateService } from './emergent-data-update.service';

describe('EmergentDataUpdateService', () => {
  let service: EmergentDataUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergentDataUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
