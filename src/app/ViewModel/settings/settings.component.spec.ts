import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsComponent} from './settings.component';
import {MatDialog} from '@angular/material/dialog';
import {MockDataModelService} from '../_mockServices/MockDataModelService';
import {Language} from '../../DataModel/Utils/Language';
import {DataModelService} from '../../DataModel/data-model.service';
import {Currency} from '../../DataModel/Utils/Currency';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {MockMatrixBasicDataService} from '../_mockServices/MockMatrixBasicDataService';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let dataModelService: DataModelService;
  let matrixBasicDataService: MatrixBasicDataService;
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
        { provide: MatrixBasicDataService, useClass: MockMatrixBasicDataService }
      ]
    })
    .compileComponents();

    dataModelService = TestBed.inject(DataModelService);
    matrixBasicDataService = TestBed.inject(MatrixBasicDataService);
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
    spy1 = spyOn(matrixBasicDataService, 'userChangeLanguage');
    spy2 = spyOn(matrixBasicDataService, 'userChangeDefaultCurrency');
    component.applySettings();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
