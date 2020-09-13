import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import {Contact} from '../../DataModel/Group/Contact';
import {Currency} from '../../DataModel/Utils/Currency';

export interface PaymentDialogData {
  // the titel of the dialog, this is not the title of the transaction
  modalTitle: string;
  description: string;
  payer: Contact;
  recipients: Contact[];
  amount: number[];
  isAdded: boolean[];
  currency: Currency;
}

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent implements OnInit{

  // Save the FormControls which check the amounts of the recipients
  formControlAmount: FormControl[];
  // Save the FormControl which check the description
  formControlDescription: FormControl;
  // Helper variable if the form is valid
  formInvalid = false;

  constructor(
    public dialogRef: MatDialogRef<PaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentDialogData) {
  }

  /**
   * Init all formControls for the Amount, because we need to know the amount of recipients before we can create them
   */
  ngOnInit(): void {
    this.formControlAmount = new Array<FormControl>(this.data.amount.length);
    for (let i = 0; i < this.data.amount.length; i++){
      this.formControlAmount[i] = new FormControl(this.data.amount[i] / 100, [Validators.required, Validators.pattern('[0-9]*[.]?[0-9]?[0-9]?')]);
    }

    this.formControlDescription = new FormControl(this.data.description, [Validators.required, Validators.maxLength(60)]);
    // this.formControlPayer = new FormControl(this.data.payer.name, [Validators.required]);
  }

  /**
   * Check if all inputs of all forms a valid
   */
  private checkForm(): boolean {

    let tempValid = false;
    for (let i = 0; i < this.data.amount.length; i++){
      if (this.formControlAmount[i].invalid && this.data.isAdded[i]){
        tempValid = true;
      }
    }

    if (this.formControlDescription.invalid || this.data.payer == null){
      tempValid = true;
    }

    return tempValid;
  }


  /**
   * Close the dialog without returning the data
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Close the dialog and return the data
   */
  onSave(): void {

    this.formInvalid = this.checkForm();

    if (!this.formInvalid){
      this.dialogRef.close(this.createReturnData());
    }
  }

  // Create the return data, with the existing data
  private createReturnData(): PaymentDialogData{
    const newDescription = this.formControlDescription.value;
    const newPayer = this.data.payer;
    const newRecipients = new Array<Contact>(0);
    const newAmount = new Array<number>(0);
    for (let i = 0; i < this.data.amount.length; i++){
        newRecipients.push(this.data.recipients[i]);
        newAmount.push(Math.round(this.formControlAmount[i].value * 100));
    }

    return {modalTitle: this.data.modalTitle, description: newDescription, payer: newPayer, recipients: newRecipients, amount: newAmount,
      isAdded: this.data.isAdded, currency: this.data.currency};

  }

  /**
   * Return an error message if the number in amount is invalid
   */
  public getInvalidNumberErrorMessage(): string{
    return 'Not a valid number';
  }

  /**
   * Return an error message if the description is invalid
   */
  public getInvalidDescriptionErrorMessage(): string{
    if (this.formControlDescription.hasError('required')){
      return 'Please enter a description';
    } else {
      return 'The description is too long';
    }
  }

  /**
   * Return an error message if there is an error in the form
   */
  public getInvalidFormErrorMessage(): string{
    return 'Not all inputs are valid';
  }

}
