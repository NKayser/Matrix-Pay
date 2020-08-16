import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {SettingsComponent} from './settings.component';
import {MatDialog} from '@angular/material/dialog';
import {MockDataModelService} from '../_mockServices/MockDataModelService';
import {Language} from '../../DataModel/Utils/Language';
import {DataModelService} from '../../DataModel/data-model.service';
import {Currency} from '../../DataModel/Utils/Currency';
import {SettingsService} from '../../ServerCommunication/SettingsCommunication/settings.service';
import {MockSettingsService} from '../_mockServices/MockSettingsService';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let dataModelService: DataModelService;
  let settingsService: SettingsService;
  let spy1: any;
  let spy2: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsComponent ],
      providers: [
        {
          provide: MatDialog,
          useValue: []
        },
        { provide: DataModelService, useClass: MockDataModelService },
        { provide: SettingsService, useClass: MockSettingsService }
      ]
    })
    .compileComponents();

    dataModelService = TestBed.inject(DataModelService);
    settingsService = TestBed.inject(SettingsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('check init values', () => {
    component.ngOnInit();
    expect(component.selectedLanguage).toBe(Language.GERMAN);
    expect(component.selectedCurrency).toBe(Currency.EUR);
  });

  it('check apply', () => {
    component.ngOnInit();
    component.selectedCurrency = Currency.EUR;
    component.selectedLanguage = Language.GERMAN;
    fixture.detectChanges();
    component.selectedCurrency = Currency.USD;
    component.selectedLanguage = Language.ENGLISH;
    fixture.detectChanges();
    spy1 = spyOn(settingsService, 'changeCurrency');
    spy2 = spyOn(settingsService, 'changeLanguage');
    component.applySettings();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
