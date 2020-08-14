import {Component, Input, OnChanges} from '@angular/core';
import {PaymentDialogData, PaymentModalComponent} from '../payment-modal/payment-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {Transaction} from '../../DataModel/Group/Transaction';
import {Group} from '../../DataModel/Group/Group';
import {TransactionType} from '../../DataModel/Group/TransactionType';
import {Contact} from '../../DataModel/Group/Contact';
import {DataModelService} from '../../DataModel/data-model.service';
import {TransactionService} from '../../ServerCommunication/GroupCommunication/transaction.service';
import {promiseTimeout, TIMEOUT} from '../promiseTimeout';
import {currencyMap} from '../../DataModel/Utils/Currency';
import {DialogProviderService} from '../dialog-provider.service';

@Component({
  selector: 'app-group-transaction',
  templateUrl: './group-transaction.component.html',
  styleUrls: ['./group-transaction.component.css']
})
export class GroupTransactionComponent implements OnChanges {

  // Input is used to pass the current selected group to the transaction component
  @Input() group: Group;

  // the data that is used to create a transaction
  private data: PaymentDialogData;
  public transactions: Transaction[] = [];

  public loadingCreateExpense = false;
  public loadingEditExpense = false;

  public currencyMap = currencyMap;

  constructor(public dialog: MatDialog, private dataModelService: DataModelService, private transactionService: TransactionService,
              private dialogProviderService: DialogProviderService) {
  }

  /**
   * Update the transaction reference every time something in the view changes, to make sure that a switch of the selected
   * group switches the transactions
   */
  ngOnChanges(): void {
    this.transactions = this.group.transactions;
  }

  /**
   * Creates an expense by opening a dialog where the user can input all necessary details
   * and send the data to matrix via the transactionService
   */
  public createExpense(): void {
    const dialogRef = this.dialog.open(PaymentModalComponent, {
      width: '350px',
      data: this.generateCreateExpenseData(),
    });

    dialogRef.afterClosed().subscribe(result => {
      this.data = result;
      if (this.data !== undefined){

        const recipientIds = [];
        const sendAmounts = [];
        for (let i = 0; i < this.data.recipients.length; i++){
          if (this.data.isAdded[i] === true){
            recipientIds.push(this.data.recipients[i].contactId);
            sendAmounts.push(this.data.amount[i]);
          }

        }

        this.loadingCreateExpense = true;
        promiseTimeout(TIMEOUT, this.transactionService.createTransaction(this.group.groupId, this.data.description,
          this.data.payer.contactId, recipientIds, sendAmounts))
          .then((data) => {
            console.log(data);
            if (!data.wasSuccessful()){
              this.dialogProviderService.openErrorModal('error create transaction 1: ' + data.getMessage(), this.dialog);
            }
            this.loadingCreateExpense = false;
          }, (err) => {
            this.dialogProviderService.openErrorModal('error create Transaction 2: ' + err, this.dialog);
            this.loadingCreateExpense = false;
          });
      }

    });
  }

  /**
   * Edit an expense by opening a dialog where the user can change the data of the selected transaction and send
   * the edited data via the transactionService to Matrix
   * @param expense the transaction that is edited
   */
  public editExpense(expense: Transaction): void{

    if (expense.transactionType === TransactionType.EXPENSE){
      const dialogRef = this.dialog.open(PaymentModalComponent, {
        width: '350px',
        data: this.generateEditExpenseData(expense),
      });

      dialogRef.afterClosed().subscribe(result => {
        this.data = result;
        if (this.data !== undefined){

          const recipientIds = [];
          const sendAmounts = [];
          for (let i = 0; i < this.data.recipients.length; i++){
            if (this.data.isAdded[i] === true){
              recipientIds.push(this.data.recipients[i].contactId);
              sendAmounts.push(this.data.amount[i]);
            }

          }

          this.loadingEditExpense = true;
          promiseTimeout(TIMEOUT, this.transactionService.modifyTransaction(this.group.groupId, expense.transactionId,
            this.data.description, this.data.payer.contactId, recipientIds, sendAmounts))
            .then((data) => {
              console.log(data);
              if (!data.wasSuccessful()){
                this.dialogProviderService.openErrorModal('error edit transaction 1: ' + data.getMessage(), this.dialog);
              }
              this.loadingEditExpense = false;
            }, (err) => {
              this.dialogProviderService.openErrorModal('error edit Transaction 2: ' + err, this.dialog);
              this.loadingEditExpense = false;
            });

        }

      });
    }
  }

  // Generate input data for expense Modal form the current transaction
  private generateEditExpenseData(transaction: Transaction): PaymentDialogData {

    const modalTitle = 'Edit Transaction';
    const recipients = Array<Contact>(0);
    const description = transaction.name;
    const payer = transaction.payer.contact;
    const amount = Array<number>(0);
    const isAdded = Array<boolean>(0);
    for (const recipient of this.group.groupmembers){
      recipients.push(recipient.contact);
      const recipientAmount = this.getRecipientAmountFromTransaction(recipient.contact.contactId, transaction);
      amount.push(recipientAmount);
      isAdded.push(recipientAmount !== 0);
    }

    return {modalTitle, description, payer, recipients, amount, isAdded};
  }

  // Generate input data for expense Modal for a create transaction modal
  private generateCreateExpenseData(): PaymentDialogData {

    const modalTitle = 'Create Transaction';
    const recipients = Array<Contact>(0);
    const description = '';
    const payer = this.dataModelService.getUser().contact;
    const amount = Array<number>(0);
    const isAdded = Array<boolean>(0);
    for (const recipient of this.group.groupmembers){
      recipients.push(recipient.contact);
      amount.push(0);
      isAdded.push(true);
    }

    return {modalTitle, description, payer, recipients, amount, isAdded};
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
