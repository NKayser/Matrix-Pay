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
import {GroupService} from '../../ServerCommunication/GroupCommunication/group.service';
import {MockGroupService} from '../_mockServices/MockGroupService';
import {MockDialog} from '../_mockServices/MockDialog';

describe('GroupSelectionComponent', () => {
  let component: GroupSelectionComponent;
  let fixture: ComponentFixture<GroupSelectionComponent>;
  let dataModelService: DataModelService;
  let groupService: GroupService;
  let spy1: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupSelectionComponent],
      providers: [
        { provide: MatDialog, useValue: MockDialog },
        { provide: DataModelService, useClass: MockDataModelService},
        { provide: GroupService, useClass: MockGroupService }
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
    groupService = TestBed.inject(GroupService);
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
    spy1 = spyOn(groupService, 'leaveGroup');
    component.leaveGroup();
    expect(spy1).toHaveBeenCalledTimes(0);
  });

  it('check add member group', () => {
    component.ngOnInit();
    spy1 = spyOn(groupService, 'addMember');
    component.addMemberToGroup();
    expect(spy1).toHaveBeenCalled();
  });

  it('check create group group', () => {
    component.ngOnInit();
    spy1 = spyOn(groupService, 'createGroup');
    component.addGroup();
    expect(spy1).toHaveBeenCalled();
  });
});
