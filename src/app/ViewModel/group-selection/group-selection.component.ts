import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {CreateGroupModalComponent, GroupCreateDialogData} from '../create-group-modal/create-group-modal.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LeaveGroupDialogData, LeaveGroupModalComponent} from '../leave-group-modal/leave-group-modal.component';
import {AddMemberToGroupDialogData, AddMemberToGroupModalComponent} from '../add-user-to-group-modal/add-member-to-group-modal.component';
import {DataModelService} from '../../DataModel/data-model.service';
import {Group} from '../../DataModel/Group/Group';
import {promiseTimeout, TIMEOUT} from '../promiseTimeout';
import {DialogProviderService} from '../dialog-provider.service';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {Time, times} from "../../SystemTests/Time";

@Component({
  selector: 'app-group-selection',
  templateUrl: './group-selection.component.html',
  styleUrls: ['./group-selection.component.css']
})
export class GroupSelectionComponent implements OnInit{

  // saves the currently selected group
  public currentGroup: Group = new Group('', '', null);
  // save returned data form dialogs
  private createGroupData: GroupCreateDialogData;
  private leaveGroupData: LeaveGroupDialogData;
  private addUserToGroupData: AddMemberToGroupDialogData;

  // saves if operation is Loading currently
  public loadingLeaveGroup = false;
  public loadingAddMember = false;
  public loadingAddGroup = false;

  // this is an array of group names, which gets displayed by the view
  // this should get read from the dataService
  public groups = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public dialog: MatDialog, private dataModelService: DataModelService,
              private matrixBasicDataService: MatrixBasicDataService, private dialogProviderService: DialogProviderService) {}

  // set default selected group
  ngOnInit(): void{
    // get all groups and select the first group as default
    this.groups = this.dataModelService.getGroups();
    if (this.groups.length >= 1){
      this.currentGroup = this.groups[0];
    }
  }

  /**
   * Select a specific group
   * @param index the index of the group to select
   */
  public selectGroup(index: number): void{
    this.currentGroup = this.groups[index];
  }

  /**
   * Leave the group that is defined by this.currentGroup
   */
  public leaveGroup(): void{
    const dialogRef = this.dialog.open(LeaveGroupModalComponent, {
      width: '300px',
      data: {group: this.currentGroup}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.leaveGroupData = result;
      if (this.leaveGroupData !== undefined){
          this.loadingLeaveGroup = true;
          promiseTimeout(TIMEOUT, this.matrixBasicDataService.leaveGroup(this.leaveGroupData.group.groupId)).then((data) => {

            if (!data.wasSuccessful()){
              this.dialogProviderService.openErrorModal('error leave group 1: ' + data.getMessage(), this.dialog);
            }
            this.loadingLeaveGroup = false;
          }, (err) => {
            this.dialogProviderService.openErrorModal('error leave group 2: ' + err, this.dialog);
            this.loadingLeaveGroup = false;
          });

      }

    });
  }

  /**
   * Add a group
   */
  public addGroup(): void {
    const dialogRef = this.dialog.open(CreateGroupModalComponent, {
      width: '300px',
      data: {groupName: '', currency: this.dataModelService.getUser().currency}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.createGroupData = result;
      if (this.createGroupData !== undefined){
        this.loadingAddGroup = true;
        times.push(new Time(Date.now(), this.currentGroup.groupId));
        console.log('GroupSelectionCompunent: logged time with id: ' + this.currentGroup.groupId);
        promiseTimeout(TIMEOUT, this.matrixBasicDataService.groupCreate(this.createGroupData.groupName,
          this.createGroupData.currency.toString()))
          .then((data) => {
          if (!data.wasSuccessful()){
            this.dialogProviderService.openErrorModal('error add group 1: ' + data.getMessage(), this.dialog);
          }
          this.loadingAddGroup = false;
        }, (err) => {
            this.dialogProviderService.openErrorModal('error add group 2: ' + err, this.dialog);
            this.loadingAddGroup = false;
        });
      }

    });
  }

  /**
   * Add a member to the group that is defined by this.currentGroup
   */
  public addMemberToGroup(): void{
    const dialogRef = this.dialog.open(AddMemberToGroupModalComponent, {
      width: '300px',
      data: {group: this.currentGroup, user: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.addUserToGroupData = result;
      if (this.addUserToGroupData !== undefined){

        this.loadingAddGroup = true;
        promiseTimeout(TIMEOUT, this.matrixBasicDataService.groupAddMember(this.addUserToGroupData.group.groupId,
          this.addUserToGroupData.user))
          .then((data) => {
            if (!data.wasSuccessful()){
              this.dialogProviderService.openErrorModal('error add member 1: ' + data.getMessage(), this.dialog);
            }
            this.loadingAddGroup = false;
          }, (err) => {
            this.dialogProviderService.openErrorModal('error add member 2: ' + err, this.dialog);
            this.loadingAddGroup = false;
          });
      }

    });
  }

}
