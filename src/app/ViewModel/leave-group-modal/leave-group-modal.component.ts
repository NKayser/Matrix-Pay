import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Group} from '../../DataModel/Group/Group';

export interface LeaveGroupDialogData {
  group: Group;
  leave: boolean;
}

@Component({
  selector: 'app-leave-group-modal',
  templateUrl: './leave-group-modal.component.html',
  styleUrls: ['./leave-group-modal.component.css']
})
export class LeaveGroupModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LeaveGroupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LeaveGroupDialogData) {
  }

  ngOnInit(): void {
  }

  /**
   * Close the dialog without returning the data
   */
  public onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Close the dialog and return the data
   */
  public onSave(): void {
    this.dialogRef.close({leave: true, group: this.data.group});
  }

}
