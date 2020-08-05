import {Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {CreateGroupModalComponent, GroupCreateDialogData} from '../create-group-modal/create-group-modal.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-group-selection',
  templateUrl: './group-selection.component.html',
  styleUrls: ['./group-selection.component.css']
})
export class GroupSelectionComponent implements OnInit{

  currentGroup: string;
  data: GroupCreateDialogData;

  // this is an array of group names, which gets displayed by the view
  // this should get read from the dataService
  groups = ['Group1', 'Group2', 'Group3'];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public dialog: MatDialog) {}

  // set default selected group
  ngOnInit(): void{
    this.currentGroup = this.groups[0];
  }

  // Select a specific group and change the view accordingly
  selectGroup(index: number): void{
    this.currentGroup = this.groups[index];
  }

  leaveGroup(): void{

  }

  createGroup(): void {
    const dialogRef = this.dialog.open(CreateGroupModalComponent, {
      width: '300px',
      data: {groupName: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.data = result;
      if (this.data !== undefined){
        // TODO Send Data to matrix here
        console.log(this.data.groupName);
      }

    });
  }

  addUserToGroup(): void{

  }

}
