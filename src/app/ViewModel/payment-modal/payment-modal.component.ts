import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';
import {Contact} from '../../DataModel/Group/Contact';

export interface PaymentDialogData {
  // the titel of the dialog, this is not the title of the transaction
  modalTitle: string;
  description: string;
  payer: Contact;
  recipients: Contact[];
  amount: number[];
  isAdded: boolean[];
}

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent implements OnInit{

  // Save the FormControls which check the amounts of the recipients
  formControlAmount: FormControl[];
  // Save the FormControl which check the description TODO Add regex
  formControlDescription: FormControl;
  // Save the FormControl which checks the payer TODO Add regex
  formControlPayer: FormControl;
  // Helper variable if the form is valid
  formInvalid = false;

  constructor(
    public dialogRef: MatDialogRef<PaymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentDialogData) {
  }

  /*
  * Init all formControls for the Amount, because we need to know the amount of recipients before we can create them
  * */
  ngOnInit(): void {
    this.formControlAmount = new Array<FormControl>(this.data.amount.length);
    for (let i = 0; i < this.data.amount.length; i++){
      this.formControlAmount[i] = new FormControl(this.data.amount[i], [Validators.required]);
    }

    this.formControlDescription = new FormControl(this.data.description, [Validators.required]);
    // this.formControlPayer = new FormControl(this.data.payer.name, [Validators.required]);
  }

  // Checks if all inputs of the form are valid
  checkForm(): boolean {

    let tempValid = false;
    for (let i = 0; i < this.data.amount.length; i++){
      if (this.formControlAmount[i].invalid && this.data.isAdded[i]){
        tempValid = true;
      }
    }

    if (this.formControlPayer.invalid){
      tempValid = true;
    }

    if (this.formControlDescription.invalid){
      tempValid = true;
    }

    return tempValid;
  }


  // Close the dialog without saving
  onCancel(): void {
    this.dialogRef.close();
  }

  // Save the dialog and return the data, if the form is valid
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
        newAmount.push(this.formControlAmount[i].value);
    }

    return {modalTitle: '', description: newDescription, payer: newPayer, recipients: newRecipients, amount: newAmount,
      isAdded: this.data.isAdded};

  }

  // Return error messages
  getInvalidNumberErrorMessage(): string{
    return 'Not a valid number';
  }

  getInvalidDescriptionErrorMessage(): string{
    return 'Not a valid number';
  }

  getInvalidPayerErrorMessage(): string{
    return 'Not a valid number';
  }

  getInvalidFormErrorMessage(): string{
    return 'Not all inputs are valid';
  }

}
