import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface AddMemberToGroupDialogData {
  group: string;
  user: string;
}

@Component({
  selector: 'app-add-user-to-group-modal',
  templateUrl: './add-member-to-group-modal.component.html',
  styleUrls: ['./add-member-to-group-modal.component.css']
})
export class AddMemberToGroupModalComponent {

  // Save the FormControl which checks the userName
  // use regex pattern according to matrix specification: https://matrix.org/docs/spec/index#users
  formControlUser = new FormControl('', [Validators.required, Validators.pattern('@[a-z0-9.-]+:[a-z0-9.-]+')]);

  constructor(
    public dialogRef: MatDialogRef<AddMemberToGroupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddMemberToGroupDialogData) {
  }

  // cancels that the user gets added to the group
  onCancel(): void {
    this.dialogRef.close();
  }

  // Save the dialog and return the data, if the form is valid
  onSave(): void {
    if (!this.formControlUser.invalid){
      this.dialogRef.close({user: this.formControlUser.value, group: this.data.group});
    }
  }

  getInvalidUserErrorMessage(): string{
    return 'Not a valid user name';
  }

}
