import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import {Currency, currencyMap} from '../../DataModel/Utils/Currency';

export interface GroupCreateDialogData {
  groupName: string;
  currency: Currency;
}

@Component({
  selector: 'app-create-group-modal',
  templateUrl: './create-group-modal.component.html',
  styleUrls: ['./create-group-modal.component.css']
})
export class CreateGroupModalComponent implements OnInit{

  // Save the FormControl which checks the GroupName
  formControlGroupName = new FormControl('', [Validators.required, Validators.maxLength(30)]);
  // Save the currently selected currency
  selectedCurrency: Currency;
  currencyMap = currencyMap;

  constructor(
    public dialogRef: MatDialogRef<CreateGroupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GroupCreateDialogData) {
  }

  ngOnInit(): void {
    this.selectedCurrency = this.data.currency;
    this.formControlGroupName.setValue(this.data.groupName);
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
    if (!this.formControlGroupName.invalid){
      this.dialogRef.close({groupName: this.formControlGroupName.value, currency: this.selectedCurrency});
    }
  }

  /**
   * Return error message if the group name is invalid
   */
  public getInvalidGroupNameErrorMessage(): string{
    if (this.formControlGroupName.hasError('required')){
      return 'Please enter a group name';
    } else {
      return 'The group name is too long';
    }
  }



}
