import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {MatDialog} from '@angular/material/dialog';
import {Recommendation} from '../../DataModel/Group/Recommendation';
import {MockDialog} from '../_mockServices/MockDialog';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {MockMatrixBasicDataService} from '../_mockServices/MockMatrixBasicDataService';
import {DataModelService} from '../../DataModel/data-model.service';
import {MockDataModelService} from '../_mockServices/MockDataModelService';
import {Group} from '../../DataModel/Group/Group';
import {Currency} from '../../DataModel/Utils/Currency';
import {SuccessfulResponse} from '../../ServerCommunication/Response/SuccessfulResponse';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let spy1: any;
  let matrixBasicDataService: MatrixBasicDataService;
  let dataModelService: DataModelService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [
        { provide: MatDialog, useValue: MockDialog },
        { provide: MatrixBasicDataService, useClass: MockMatrixBasicDataService},
        { provide: DataModelService, useClass: MockDataModelService}
      ]
    })
    .compileComponents();

    matrixBasicDataService = TestBed.inject(MatrixBasicDataService);
    dataModelService = TestBed.inject(DataModelService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/

  it('cancel recommendation', () => {
    component.recommendations = [new Recommendation(new Group('1', '1', Currency.USD), null, null)];

    spy1 = spyOn(matrixBasicDataService, 'confirmPayback');
    component.confirmPayback(0);
    expect(spy1).toHaveBeenCalled();

  });
});
