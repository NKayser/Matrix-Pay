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
import {MockDialog, MockDialogCancel} from '../_mockServices/MockDialog';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {MockMatrixBasicDataService} from '../_mockServices/MockMatrixBasicDataService';
import {GroupTransactionComponent} from '../group-transaction/group-transaction.component';
import {HistoryComponent} from '../history/history.component';
import {GroupBalanceComponent} from '../group-balance/group-balance.component';
import {HomeComponent} from '../home/home.component';
import {Group} from '../../DataModel/Group/Group';
import {Currency} from '../../DataModel/Utils/Currency';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Contact} from '../../DataModel/Group/Contact';
import {User} from '../../DataModel/User/User';
import {Language} from '../../DataModel/Utils/Language';

describe('GroupSelectionComponentCancel', () => {
  let component: GroupSelectionComponent;
  let fixture: ComponentFixture<GroupSelectionComponent>;

  let dataModelService: jasmine.SpyObj<DataModelService>;
  let matrixBasicDataService: jasmine.SpyObj<MatrixBasicDataService>;

  beforeEach(async(() => {

    const spyData = jasmine.createSpyObj('DataModelService', ['getUser', 'getGroups']);
    const spyMatrix = jasmine.createSpyObj('MatrixBasicDataService', ['groupAddMember', 'leaveGroup', 'groupCreate']);

    TestBed.configureTestingModule({
      declarations: [GroupSelectionComponent, GroupTransactionComponent, HistoryComponent, GroupBalanceComponent],
      providers: [
        { provide: MatDialog, useValue: MockDialogCancel },
        { provide: MatrixBasicDataService, useValue: spyMatrix},
        { provide: DataModelService, useValue: spyData}
      ]
    }).compileComponents();



    dataModelService = TestBed.inject(DataModelService) as jasmine.SpyObj<DataModelService>;
    matrixBasicDataService = TestBed.inject(MatrixBasicDataService) as jasmine.SpyObj<MatrixBasicDataService>;

    fixture = TestBed.createComponent(GroupSelectionComponent);
    component = fixture.componentInstance;
  }));

  it('currentGroupSet', () => {

    const c1 = new Contact('c1', 'Alice');
    const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
    dataModelService.getUser.and.returnValue(stubValueUser);

    const g1 = new Group('g1', 'name_g1', Currency.USD);
    const g2 = new Group('g2', 'name_g2', Currency.USD);

    dataModelService.getGroups.and.returnValue([g1, g2]);
    fixture.detectChanges();

    expect(component.currentGroup.groupId).toEqual('g1');
    expect(component.groups.length).toEqual(2);
    component.selectGroup(1);
    expect(component.currentGroup.groupId).toEqual('g2');
  });

  it('check add member to group cancel', () => {
    const c1 = new Contact('c1', 'Alice');
    const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
    dataModelService.getUser.and.returnValue(stubValueUser);

    const g1 = new Group('g1', 'name_g1', Currency.USD);
    const g2 = new Group('g2', 'name_g2', Currency.USD);

    dataModelService.getGroups.and.returnValue([g1, g2]);
    fixture.detectChanges();
    component.addMemberToGroup();
    expect(matrixBasicDataService.groupAddMember).not.toHaveBeenCalled();
  });

  it('check leave group cancel', () => {
    const c1 = new Contact('c1', 'Alice');
    const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
    dataModelService.getUser.and.returnValue(stubValueUser);

    const g1 = new Group('g1', 'name_g1', Currency.USD);
    const g2 = new Group('g2', 'name_g2', Currency.USD);

    dataModelService.getGroups.and.returnValue([g1, g2]);
    fixture.detectChanges();
    component.leaveGroup();
    expect(matrixBasicDataService.leaveGroup).not.toHaveBeenCalled();
  });

  it('check create group cancel', () => {
    const c1 = new Contact('c1', 'Alice');
    const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
    dataModelService.getUser.and.returnValue(stubValueUser);

    const g1 = new Group('g1', 'name_g1', Currency.USD);
    const g2 = new Group('g2', 'name_g2', Currency.USD);

    dataModelService.getGroups.and.returnValue([g1, g2]);
    fixture.detectChanges();
    component.addGroup();
    expect(matrixBasicDataService.groupCreate).not.toHaveBeenCalled();
  });
});

describe('GroupSelectionComponentConfirm', () => {
  let component: GroupSelectionComponent;
  let fixture: ComponentFixture<GroupSelectionComponent>;

  let dataModelService: jasmine.SpyObj<DataModelService>;
  let matrixBasicDataService: jasmine.SpyObj<MatrixBasicDataService>;

  beforeEach(async(() => {

    const spyData = jasmine.createSpyObj('DataModelService', ['getUser', 'getGroups']);
    const spyMatrix = jasmine.createSpyObj('MatrixBasicDataService', ['groupAddMember', 'leaveGroup', 'groupCreate']);

    TestBed.configureTestingModule({
      declarations: [GroupSelectionComponent, GroupTransactionComponent, HistoryComponent, GroupBalanceComponent],
      providers: [
        { provide: MatDialog, useValue: MockDialog },
        { provide: MatrixBasicDataService, useValue: spyMatrix},
        { provide: DataModelService, useValue: spyData}
      ]
    }).compileComponents();



    dataModelService = TestBed.inject(DataModelService) as jasmine.SpyObj<DataModelService>;
    matrixBasicDataService = TestBed.inject(MatrixBasicDataService) as jasmine.SpyObj<MatrixBasicDataService>;

    fixture = TestBed.createComponent(GroupSelectionComponent);
    component = fixture.componentInstance;
  }));

  it('check add member to group cancel', () => {
    const c1 = new Contact('c1', 'Alice');
    const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
    dataModelService.getUser.and.returnValue(stubValueUser);

    const g1 = new Group('g1', 'name_g1', Currency.USD);
    const g2 = new Group('g2', 'name_g2', Currency.USD);

    dataModelService.getGroups.and.returnValue([g1, g2]);
    fixture.detectChanges();
    component.addMemberToGroup();
    expect(matrixBasicDataService.groupAddMember).toHaveBeenCalled();
  });

  it('check leave group cancel', () => {
    const c1 = new Contact('c1', 'Alice');
    const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
    dataModelService.getUser.and.returnValue(stubValueUser);

    const g1 = new Group('g1', 'name_g1', Currency.USD);
    const g2 = new Group('g2', 'name_g2', Currency.USD);

    dataModelService.getGroups.and.returnValue([g1, g2]);
    fixture.detectChanges();
    component.leaveGroup();
    expect(matrixBasicDataService.leaveGroup).toHaveBeenCalled();
  });

  it('check create group cancel', () => {
    const c1 = new Contact('c1', 'Alice');
    const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
    dataModelService.getUser.and.returnValue(stubValueUser);

    const g1 = new Group('g1', 'name_g1', Currency.USD);
    const g2 = new Group('g2', 'name_g2', Currency.USD);

    dataModelService.getGroups.and.returnValue([g1, g2]);
    fixture.detectChanges();
    component.addGroup();
    expect(matrixBasicDataService.groupCreate).toHaveBeenCalled();
  });
});
