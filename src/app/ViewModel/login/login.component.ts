import { Component, Output, EventEmitter} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatrixClientService} from '../../ServerCommunication/CommunicationInterface/matrix-client.service';
import {ClientInterface} from "../../ServerCommunication/CommunicationInterface/ClientInterface";
import {ServerResponse} from "../../ServerCommunication/Response/ServerResponse";
import {LoginError} from "../../ServerCommunication/Response/ErrorTypes";
import {SettingsService} from "../../ServerCommunication/SettingsCommunication/settings.service";
import {TransactionService} from "../../ServerCommunication/GroupCommunication/transaction.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private clientService: ClientInterface;
  private settingsService: SettingsService; // delete later
  private transactionService: TransactionService; // delete later

  // emitter to tell the App Component to display the Menu when logged in
  @Output() loggedIn = new EventEmitter<boolean>();

  // Manages if the password is shown in the view
  hide = true;

  // gets the input values of the user and checks if they obey all requirements
  matrixUrlControl = new FormControl('', [Validators.required, Validators.pattern('.*')]);
  passwordControl = new FormControl('', [Validators.required]);

  constructor(clientService: MatrixClientService, settingsService: SettingsService, transactionService: TransactionService) {
    this.clientService = clientService;
    this.settingsService = settingsService;
    this.transactionService = transactionService;
  }


  // login the user with the current values if matrixUrl and password
  async login() {

      // check all formControls to make sure all values are correct
      this.matrixUrlControl.markAllAsTouched();
      this.passwordControl.markAllAsTouched();

      // check if any values are incorrect, if no pass them to the service
      if (!this.matrixUrlControl.invalid && !this.passwordControl.invalid){
        // Make here the call to register the user in the clientInterface with this.matrixUrlControl.value and
        // this.passwordControl.value
        const loginResponse: ServerResponse = await this.clientService.login(this.matrixUrlControl.value,
          this.passwordControl.value);

        if (loginResponse.wasSuccessful()) {
          console.log('logIn successful !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        } else {
          console.log('logIn failed :/    :( because ' + LoginError[loginResponse.getError()]);
        }

        // Error could be thrown here already
        const currencyResponse: ServerResponse = await this.settingsService.changeCurrency("EURO");

        if (currencyResponse.wasSuccessful()) {
          console.log('currency changed');
        } else {
          console.log('currency not changed ' + currencyResponse);
        }

        const transactionResponse: ServerResponse = await this.transactionService.modifyTransaction(
          "!aNKgLTFyuhwBnCHPXe:dsn.tm.kit.edu", "$KxQau9JUzLvnTSg5hCzyAEfZx3FjTnJHJkqyCszBuao",
          "Pizza Modified", "@uzpjs:dsn.tm.kit.edu",
          ["@uzpjs:dsn.tm.kit.edu", "@uelkt:dsn.tm.kit.edu"], [400, 500]
        );

        if (transactionResponse.wasSuccessful()) {
          console.log('transaction created');
        } else {
          console.log('transaction not created because ' + transactionResponse.getError());
        }

        //console.log(this.matrixUrlControl.value + ' ' + this.passwordControl.value);

        // Tell AppComponent, that user is logged in
        this.loggedIn.emit(true);
      }
  }

  // get the error message for the password form
  getPasswordErrorMessage(): string{
    return 'Please enter a password';
  }

  // get the error message for the matrixUrl form
  getMatrixUrlErrorMessage(): string{
    if (this.matrixUrlControl.hasError('required')){
      return 'Please enter a matrixUrl';
    } else {
      return 'Please enter a valid matrixUrl';
    }
  }

}
