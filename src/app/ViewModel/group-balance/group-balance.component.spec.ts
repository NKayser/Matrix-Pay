import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBalanceComponent } from './group-balance.component';
import {MatDialog} from '@angular/material/dialog';
import {MockDialog} from '../_mockServices/MockDialog';
import {Currency} from '../../DataModel/Utils/Currency';
import {Group} from '../../DataModel/Group/Group';
import {Recommendation} from '../../DataModel/Group/Recommendation';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {MockMatrixBasicDataService} from '../_mockServices/MockMatrixBasicDataService';

describe('GroupBalanceComponent', () => {
  let component: GroupBalanceComponent;
  let fixture: ComponentFixture<GroupBalanceComponent>;
  let matrixBasicDataService: MatrixBasicDataService;
  let spy1: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupBalanceComponent ],
      providers: [
        { provide: MatDialog, useValue: MockDialog },
        { provide: MatrixBasicDataService, useClass: MockMatrixBasicDataService}
      ]
    })
    .compileComponents();

    matrixBasicDataService = TestBed.inject(MatrixBasicDataService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check for input', () => {
    const group1 = new Group('1', '1', Currency.USD);
    group1.setRecommendations([new Recommendation(group1, null, null)]);
    component.group = group1;
    component.ngOnChanges();
    expect(component.recommendations).toEqual(group1.recommendations);

    const group2 = new Group('2', '2', Currency.USD);
    group2.setRecommendations([new Recommendation(group2, null, null)]);
    component.group = group2;
    component.ngOnChanges();
    expect(component.recommendations).toEqual(group2.recommendations);
  });

  it('cancel recommendation', () => {
    const group1 = new Group('1', '1', Currency.USD);
    group1.setRecommendations([new Recommendation(group1, null, null)]);
    component.group = group1;

    spy1 = spyOn(matrixBasicDataService, 'confirmPayback');
    component.confirmPayback(0);
    expect(spy1).toHaveBeenCalledTimes(0);

  });
});
