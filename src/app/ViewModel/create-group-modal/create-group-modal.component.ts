import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';

export interface GroupCreateDialogData {
  groupName: string;
}

@Component({
  selector: 'app-create-group-modal',
  templateUrl: './create-group-modal.component.html',
  styleUrls: ['./create-group-modal.component.css']
})
export class CreateGroupModalComponent implements OnInit {

  // Save the FormControl which checks the GroupName TODO Add regex
  formControlGroupName = new FormControl('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<CreateGroupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GroupCreateDialogData) {
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Save the dialog and return the data, if the form is valid
  onSave(): void {
    if (!this.formControlGroupName.invalid){
      this.dialogRef.close({groupName: this.formControlGroupName.value});
    }
  }

  getInvalidGroupNameErrorMessage(): string{
    return 'Not a valid group name';
  }



}
