import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';
import {AppComponent} from "../../app.component";
import {LoginError} from "../Response/ErrorTypes";
import {ServerResponse} from "../Response/ServerResponse";

describe('SettingsServiceService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
