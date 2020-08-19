import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { GroupSelectionComponent } from './group-selection.component';
import {MatDialog} from '@angular/material/dialog';
import {DataModelService} from '../../DataModel/data-model.service';
import {MockDataModelService} from '../_mockServices/MockDataModelService';
import {MockDialog} from '../_mockServices/MockDialog';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {MockMatrixBasicDataService} from '../_mockServices/MockMatrixBasicDataService';
import {GroupTransactionComponent} from '../group-transaction/group-transaction.component';
import {HistoryComponent} from '../history/history.component';
import {GroupBalanceComponent} from '../group-balance/group-balance.component';

describe('GroupSelectionComponent', () => {
  let component: GroupSelectionComponent;
  let fixture: ComponentFixture<GroupSelectionComponent>;
  let dataModelService: DataModelService;
  let matrixBasicDataService: MatrixBasicDataService;
  let spy1: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupSelectionComponent, GroupTransactionComponent, HistoryComponent, GroupBalanceComponent],
      providers: [
        { provide: MatDialog, useValue: MockDialog },
        { provide: DataModelService, useClass: MockDataModelService},
        { provide: MatrixBasicDataService, useClass: MockMatrixBasicDataService }
      ],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
      ]
    }).compileComponents();

    dataModelService = TestBed.inject(DataModelService);
    matrixBasicDataService = TestBed.inject(MatrixBasicDataService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should compile', () => {
    expect(component).toBeTruthy();
  });*/

  it('currentGroupSet', () => {
    component.ngOnInit();
    expect(component.currentGroup.groupId).toEqual('1');
    expect(component.groups.length).toEqual(2);
    component.selectGroup(1);
    expect(component.currentGroup.groupId).toEqual('2');
  });

  it('check leave group cancel', () => {
    component.ngOnInit();
    spy1 = spyOn(matrixBasicDataService, 'leaveGroup');
    component.leaveGroup();
    expect(spy1).toHaveBeenCalledTimes(0);
  });

  it('check add member to group', () => {
    component.ngOnInit();
    spy1 = spyOn(matrixBasicDataService, 'groupAddMember');
    component.addMemberToGroup();
    expect(spy1).toHaveBeenCalled();
  });

  it('check create group', () => {
    component.ngOnInit();
    spy1 = spyOn(matrixBasicDataService, 'groupCreate');
    component.addGroup();
    expect(spy1).toHaveBeenCalled();
  });
});
