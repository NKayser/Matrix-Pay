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
  formControlGroupName = new FormControl('', [Validators.required]);
  selectedCurrency: Currency;
  currencyMap = currencyMap;

  constructor(
    public dialogRef: MatDialogRef<CreateGroupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GroupCreateDialogData) {
  }

  ngOnInit(): void {
    this.selectedCurrency = this.data.currency;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Save the dialog and return the data, if the form is valid
  onSave(): void {
    if (!this.formControlGroupName.invalid){
      this.dialogRef.close({groupName: this.formControlGroupName.value, currency: this.selectedCurrency});
    }
  }

  getInvalidGroupNameErrorMessage(): string{
    return 'Not a valid group name';
  }



}
