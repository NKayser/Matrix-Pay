import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Contact} from '../../DataModel/Group/Contact';
import {Currency, currencyMap} from '../../DataModel/Utils/Currency';


export interface ConfirmPaybackDialogData {
  group: string;
  recipient: Contact;
  amount: number;
  currency: Currency;
  confirm: boolean;
}

@Component({
  selector: 'app-confirm-payback-modal',
  templateUrl: './confirm-payback-modal.component.html',
  styleUrls: ['./confirm-payback-modal.component.css']
})
export class ConfirmPaybackModalComponent {

  currencyMap = currencyMap;

  constructor(
    public dialogRef: MatDialogRef<ConfirmPaybackModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmPaybackDialogData) {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // Save the dialog and return the data, if the form is valid
  onSave(): void {
    this.data.confirm = true;
    this.dialogRef.close(this.data);
  }

}
