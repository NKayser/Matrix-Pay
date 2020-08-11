import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Group} from '../../DataModel/Group/Group';

export interface AddMemberToGroupDialogData {
  group: Group;
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

  /**
   * Closes the dialog without returning the data
   */
  public onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the dialog and returns the data
   */
  public onSave(): void {
    if (!this.formControlUser.invalid){
      this.dialogRef.close({user: this.formControlUser.value, group: this.data.group});
    }
  }

  /**
   * Returns error message if the user inputs invalid member
   */
  public getInvalidUserErrorMessage(): string{
    return 'Not a valid user name';
  }

}
