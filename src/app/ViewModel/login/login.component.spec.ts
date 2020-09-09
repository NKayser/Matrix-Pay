import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {MatrixClientService} from '../../ServerCommunication/CommunicationInterface/matrix-client.service';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {MatrixEmergentDataService} from '../../ServerCommunication/CommunicationInterface/matrix-emergent-data.service';
import {DataModelService} from '../../DataModel/data-model.service';
import {SuccessfulResponse} from '../../ServerCommunication/Response/SuccessfulResponse';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MockDialogCancel} from '../_mockServices/MockDialog';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let matrixClientService: jasmine.SpyObj<MatrixClientService>;
  let matrixBasicDataService: jasmine.SpyObj<MatrixBasicDataService>;
  let matrixEmergentDataService: jasmine.SpyObj<MatrixEmergentDataService>;
  let dataModelService: jasmine.SpyObj<DataModelService>;

  beforeEach(async(() => {

    const spyClient = jasmine.createSpyObj('MatrixClientService', ['login']);
    const spyBasicMatrix = jasmine.createSpyObj('MatrixBasicDataService', ['createTransaction']);
    const spyEmergent = jasmine.createSpyObj('MatrixEmergentDataService', ['setBalances']);
    const spyData = jasmine.createSpyObj('DataModelService', ['getUser']);

    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        { provide: MatrixClientService, useValue: spyClient },
        { provide: MatrixBasicDataService, useValue: spyBasicMatrix },
        { provide: MatrixEmergentDataService, useValue: spyEmergent },
        { provide: DataModelService, useValue: spyData },
        { provide: MatDialog, useValue: MockDialogCancel }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();

    matrixClientService = TestBed.inject(MatrixClientService) as jasmine.SpyObj<MatrixClientService>;
    matrixBasicDataService = TestBed.inject(MatrixBasicDataService) as jasmine.SpyObj<MatrixBasicDataService>;
    matrixEmergentDataService = TestBed.inject(MatrixEmergentDataService) as jasmine.SpyObj<MatrixEmergentDataService>;
    dataModelService = TestBed.inject(DataModelService) as jasmine.SpyObj<DataModelService>;
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  }));

  it('check password error messages', () => {
    expect(component.getPasswordErrorMessage()).toEqual('Please enter a password');
  });

  it('check user error messages missing', () => {
    component.matrixUrlControl.setValue('');
    expect(component.getMatrixUrlErrorMessage()).toEqual('Please enter a matrixUrl');
  });

  it('check user error messages wrong', () => {
    component.matrixUrlControl.setValue('u1');
    expect(component.getMatrixUrlErrorMessage()).toEqual('Please enter a valid matrixUrl');
  });

  it('login', () => {
    component.matrixUrlControl.setValue('@username:host');
    component.passwordControl.setValue('password123');
    matrixClientService.login.and.returnValue(Promise.resolve(new SuccessfulResponse()));
    component.login();
    expect(matrixClientService.login).toHaveBeenCalled();
  });
});
