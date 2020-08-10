import { Component, Output, EventEmitter} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatrixClientService} from '../../ServerCommunication/CommunicationInterface/matrix-client.service';
import {ClientInterface} from '../../ServerCommunication/CommunicationInterface/ClientInterface';
import {ClientError, EmergentDataError} from '../../ServerCommunication/Response/ErrorTypes';
import {ServerResponse} from '../../ServerCommunication/Response/ServerResponse';
import {EmergentDataInterface} from "../../ServerCommunication/CommunicationInterface/EmergentDataInterface";
import {MatrixEmergentDataService} from "../../ServerCommunication/CommunicationInterface/matrix-emergent-data.service";
// @ts-ignore
import {MatrixClient, MatrixEvent} from "matrix-js-sdk";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private clientService: ClientInterface;
  private emergentDataService: EmergentDataInterface;

  // emitter to tell the App Component to display the Menu when logged in
  @Output() loggedIn = new EventEmitter<boolean>();

  // Manages if the password is shown in the view
  hide = true;

  // gets the input values of the user and checks if they obey all requirements
  matrixUrlControl = new FormControl('', [Validators.required, Validators.pattern('@[a-z0-9.-]+:[a-z0-9.-]+')]);
  passwordControl = new FormControl('', [Validators.required]);

  constructor(clientService: MatrixClientService, emergentDataService: MatrixEmergentDataService) {
    this.clientService = clientService;
    this.emergentDataService = emergentDataService;
  }


  // login the user with the current values if matrixUrl and password
  async login(): Promise<void> {

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
          console.log('logIn failed :/    :( because ' + ClientError[loginResponse.getError()]);
        }

        const emergentResponse: ServerResponse = await this.emergentDataService.setBalances(
          '!BGBWYmlePjKITRjxXS:dsn.tm.kit.edu', [100, 200, -300], ['Mickey Mouse', 'Hello Kitty', 'Donald Duck'], 'id_xyz');

        if (emergentResponse.wasSuccessful()) {
          console.log('emergent successful !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        } else {
          console.log('emergent failed :/    :( because ' + EmergentDataError[emergentResponse.getError()]);
        }

        const client: MatrixClient = await this.clientService.getPreparedClient();
        const room = await client.getRoom('!BGBWYmlePjKITRjxXS:dsn.tm.kit.edu');
        const accountDataEvent = await room['accountData']['balances'];
        const accountData = accountDataEvent.getContent();
        console.log(accountData);

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
