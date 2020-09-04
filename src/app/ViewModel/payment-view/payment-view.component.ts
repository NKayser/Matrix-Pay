import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PaymentDialogData} from '../payment-modal/payment-modal.component';
import {currencyMap} from '../../DataModel/Utils/Currency';

@Component({
  selector: 'app-payment-view',
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.css']
})
export class PaymentViewComponent implements OnInit{

  currencyMap = currencyMap;

  constructor(
      public dialogRef: MatDialogRef<PaymentViewComponent>,
      @Inject(MAT_DIALOG_DATA) public data: PaymentDialogData) {
  }

  /**
   * Init all formControls for the Amount, because we need to know the amount of recipients before we can create them
   */
  ngOnInit(): void {

    const tempData = [];
    for (let i = 0; i < this.data.amount.length; i++){
      if (this.data.isAdded[i]){
        tempData.push(this.data.recipients[i]);
      }
    }
    this.data.recipients = tempData;

  }

  /**
   * Close the dialog without returning the data
   */
  onCancel(): void {
    this.dialogRef.close();
  }

}
