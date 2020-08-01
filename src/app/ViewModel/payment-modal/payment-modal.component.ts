import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  // the titel of the dialog, this is not the title of the transaction
  modalTitle: string;
  description: string;
  payerId: string;
  recipientsId: string[];
  amount: number[];
  isAdded: boolean[];
}

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent{

  isAdvanced = false;

  constructor(
    public dialogRef: MatDialogRef<PaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

  }

  // Close the dialog without saving
  onCancel(): void {
    this.dialogRef.close();
  }

}
