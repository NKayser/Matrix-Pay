import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {CreateGroupModalComponent, GroupCreateDialogData} from '../create-group-modal/create-group-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {LeaveGroupDialogData, LeaveGroupModalComponent} from '../leave-group-modal/leave-group-modal.component';
import {AddMemberToGroupDialogData, AddMemberToGroupModalComponent} from '../add-user-to-group-modal/add-member-to-group-modal.component';
import {DataModelService} from '../../DataModel/data-model.service';
import {Currency} from '../../DataModel/Utils/Currency';
import {Group} from '../../DataModel/Group/Group';
import {Transaction} from '../../DataModel/Group/Transaction';
import {TransactionType} from '../../DataModel/Group/TransactionType';
import {Contact} from '../../DataModel/Group/Contact';
import {Groupmember} from '../../DataModel/Group/Groupmember';
import {AtomarChange} from '../../DataModel/Group/AtomarChange';
import {Recommendation} from '../../DataModel/Group/Recommendation';

@Component({
  selector: 'app-group-selection',
  templateUrl: './group-selection.component.html',
  styleUrls: ['./group-selection.component.css']
})
export class GroupSelectionComponent implements OnInit{

  currentGroup: Group;
  createGroupData: GroupCreateDialogData;
  leaveGroupData: LeaveGroupDialogData;
  addUserToGroupData: AddMemberToGroupDialogData;

  // this is an array of group names, which gets displayed by the view
  // this should get read from the dataService
  groups = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public dialog: MatDialog, private dataModelService: DataModelService) {}

  // set default selected group
  ngOnInit(): void{


    // TODO Remove test code
    this.dataModelService.initializeUserFirstTime('', '');
    this.dataModelService.getUser().createGroup('1', 'gruppe1', Currency.EUR);
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const c3 = new Contact('c3', 'Eve');
    const testGroup = this.dataModelService.getGroup('1');
    const m1 = new Groupmember(c1, testGroup);
    const m2 = new Groupmember(c2, testGroup);
    const m3 = new Groupmember(c3, testGroup);
    testGroup.addGroupmember(m1);
    testGroup.addGroupmember(m2);
    testGroup.addGroupmember(m3);
    testGroup.addTransaction(new Transaction(TransactionType.EXPENSE, 't1', 't1', new Date(2020, 10, 5), testGroup,
      new AtomarChange(c1, 10), [new AtomarChange(c2, 10)], m1));
    testGroup.addTransaction(new Transaction(TransactionType.EXPENSE, 't2', 'another one', new Date(2020, 10, 13), testGroup,
      new AtomarChange(c3, 15), [new AtomarChange(c2, 15)], m1));
    const r1 = new Recommendation(testGroup, new AtomarChange(c1, 10), new AtomarChange(c2, -10));
    const r2 = new Recommendation(testGroup, new AtomarChange(c3, 15), new AtomarChange(c1, -15));
    testGroup.setRecommendations([r1, r2]);
    // TODO test code ends here

    this.groups = this.dataModelService.getGroups();
    if (this.groups.length >= 1){
      this.currentGroup = this.groups[0];
    }
  }

  // Select a specific group and change the view accordingly
  selectGroup(index: number): void{
    this.currentGroup = this.groups[index];
  }

  leaveGroup(): void{
    const dialogRef = this.dialog.open(LeaveGroupModalComponent, {
      width: '300px',
      data: {group: '', leave: false}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.leaveGroupData = result;
      if (this.leaveGroupData !== undefined){
        // TODO Send Data to matrix here
        console.log(this.leaveGroupData.leave);
      }

    });
  }

  // TODO currency selection is missing
  addGroup(): void {
    const dialogRef = this.dialog.open(CreateGroupModalComponent, {
      width: '300px',
      data: {groupName: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.createGroupData = result;
      if (this.createGroupData !== undefined){
        // TODO Send Data to matrix here
        console.log(this.createGroupData.groupName);
      }

    });
  }

  addMemberToGroup(): void{
    const dialogRef = this.dialog.open(AddMemberToGroupModalComponent, {
      width: '300px',
      data: {group: '', user: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.addUserToGroupData = result;
      if (this.addUserToGroupData !== undefined){
        // TODO Send Data to matrix here
        console.log(this.addUserToGroupData.user);
      }

    });
  }

}
