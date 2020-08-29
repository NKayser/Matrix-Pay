import { TestBed } from '@angular/core/testing';
import { BasicDataUpdateService } from '../Update/basic-data-update.service';

describe('BasicDataUpdateService', () => {
  let service: BasicDataUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicDataUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
