import { Component} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatrixClientService} from '../../ServerCommunication/CommunicationInterface/matrix-client.service';
import {ClientInterface} from "../../ServerCommunication/CommunicationInterface/ClientInterface";
import {ServerResponse} from "../../ServerCommunication/Response/ServerResponse";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private clientService: ClientInterface;

  // Manages if the password is shown in the view
  hide = true;

  // gets the input values of the user and checks if they obey all requirements
  matrixUrlControl = new FormControl('', [Validators.required, Validators.pattern('.*')]);
  passwordControl = new FormControl('', [Validators.required]);

  constructor(clientService: MatrixClientService) {
    this.clientService = clientService;
  }


  // login the user with the current values if matrixUrl and password
  login(): void{

      // check all formControls to make sure all values are correct
      this.matrixUrlControl.markAllAsTouched();
      this.passwordControl.markAllAsTouched();

      // check if any values are incorrect, if no pass them to the service
      if (!this.matrixUrlControl.invalid && !this.passwordControl.invalid){

        // Make here the call to register the user in the clientInterface with this.matrixUrlControl.value and
        // this.passwordControl.value
        this.clientService.login(this.matrixUrlControl.value, this.passwordControl.value)
          .then(val => console.log('logIn successful !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'));

        console.log(this.matrixUrlControl.value + ' ' + this.passwordControl.value);
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
