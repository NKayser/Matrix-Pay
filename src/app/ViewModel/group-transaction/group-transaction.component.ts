import { Component } from '@angular/core';
import {DialogData, PaymentModalComponent} from '../payment-modal/payment-modal.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-group-transaction',
  templateUrl: './group-transaction.component.html',
  styleUrls: ['./group-transaction.component.css']
})
export class GroupTransactionComponent {

  // the data that is used to create a transaction
  data: DialogData;

  constructor(public dialog: MatDialog) { }


  editTransaction(index: number): void{
  }

  // open a dialog window, when it gets closed check if you got data and save it accordingly
  createTransaction(): void {
    const dialogRef = this.dialog.open(PaymentModalComponent, {
      width: '250px',
      data: {modalTitle: 'Create Transaction'}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.data = result;
      if (this.data !== undefined){
        console.log(this.data.description);
      }

    });
  }

}
