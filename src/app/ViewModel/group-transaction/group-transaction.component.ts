import {Component, Input, OnInit} from '@angular/core';
import {PaymentDialogData, PaymentModalComponent} from '../payment-modal/payment-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {Transaction} from '../../DataModel/Group/Transaction';
import {Group} from '../../DataModel/Group/Group';
import {TransactionType} from '../../DataModel/Group/TransactionType';
import {Contact} from '../../DataModel/Group/Contact';
import {DataModelService} from '../../DataModel/data-model.service';

@Component({
  selector: 'app-group-transaction',
  templateUrl: './group-transaction.component.html',
  styleUrls: ['./group-transaction.component.css']
})
export class GroupTransactionComponent implements OnInit {

  // Input is used to pass the current selected group to the transaction component
  @Input() group: Group;

  // the data that is used to create a transaction
  data: PaymentDialogData;
  transactions: Transaction[] = [];

  constructor(public dialog: MatDialog, private dataModelService: DataModelService) {
  }

  ngOnInit(): void {
    this.transactions = this.group.transactions;
  }

  // open a dialog window, when it gets closed check if you got data and save it accordingly
  createExpense(): void {
    const dialogRef = this.dialog.open(PaymentModalComponent, {
      width: '350px',
      data: this.generateCreateExpenseData(),
    });

    dialogRef.afterClosed().subscribe(result => {
      this.data = result;
      if (this.data !== undefined){
        // TODO Send Data to matrix here
        console.log(this.data.description);
      }

    });
  }

  editExpense(transaction: Transaction): void{

    if (transaction.transactionType === TransactionType.EXPENSE){
      const dialogRef = this.dialog.open(PaymentModalComponent, {
        width: '350px',
        data: this.generateEditExpenseData(transaction),
      });

      dialogRef.afterClosed().subscribe(result => {
        this.data = result;
        if (this.data !== undefined){
          // TODO Send Data to matrix here
          console.log(this.data.description);
        }

      });
    }
  }

  // Generate input data for expense Modal form the current transaction
  private generateEditExpenseData(transaction: Transaction): PaymentDialogData {

    const modalTitle = 'Edit Transaction';
    const recipientsId = Array<Contact>(0);
    const description = transaction.name;
    const payerId = transaction.payer.contact;
    const amount = Array<number>(0);
    const isAdded = Array<boolean>(0);
    for (const recipient of this.group.groupmembers){
      recipientsId.push(recipient.contact);
      const recipientAmount = this.getRecipientAmountFromTransaction(recipient.contact.contactId, transaction);
      amount.push(recipientAmount);
      isAdded.push(recipientAmount !== 0);
    }

    recipientsId.shift();
    amount.shift();
    isAdded.shift();

    return {modalTitle, description, payerId, recipientsId, amount, isAdded};
  }

  // Generate input data for expense Modal for a create transaction modal
  private generateCreateExpenseData(): PaymentDialogData {

    const modalTitle = 'Create Transaction';
    const recipientsId = Array<Contact>(0);
    const description = '';
    const payerId = this.dataModelService.getUser().contact;
    const amount = Array<number>(0);
    const isAdded = Array<boolean>(0);
    for (const recipient of this.group.groupmembers){
      recipientsId.push(recipient.contact);
      amount.push(0);
      isAdded.push(true);
    }

    recipientsId.shift();
    amount.shift();
    isAdded.shift();

    return {modalTitle, description, payerId, recipientsId, amount, isAdded};
  }

  // get the amount of a recipient, if the recipient is not in the transaction return 0
  private getRecipientAmountFromTransaction(recipientId: string, transaction: Transaction): number {

    for (const recipient of transaction.recipients){
      if (recipient.contact.contactId === recipientId){
        return recipient.amount;
      }
    }

    return 0;
  }



  fetchHistory(): void{

  }

}
