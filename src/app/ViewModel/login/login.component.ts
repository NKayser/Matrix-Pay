import {Component, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatrixClientService} from '../../ServerCommunication/CommunicationInterface/matrix-client.service';
import {ClientError} from '../../ServerCommunication/Response/ErrorTypes';
import {ServerResponse} from '../../ServerCommunication/Response/ServerResponse';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {MatrixEmergentDataService} from '../../ServerCommunication/CommunicationInterface/matrix-emergent-data.service';
import {DataModelService} from '../../DataModel/data-model.service';
import {Subscription} from 'rxjs';

// @ts-ignore
import {MatrixEvent} from 'matrix-js-sdk';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{

  // emitter to tell the App Component to display the Menu when logged in
  @Output() loggedIn = new EventEmitter<boolean>();

  // Manages if the password is shown in the view
  public hidePassword = true;
  public loadingLogIn = false;

  private subscription: Subscription;

  // gets the input values of the user and checks if they obey all requirements
  public matrixUrlControl = new FormControl('', [Validators.required, Validators.pattern('@[a-z0-9.-]+:[a-z0-9.-]+')]);
  public passwordControl = new FormControl('', [Validators.required]);

  constructor(private clientService: MatrixClientService,
              private emergentDataService: MatrixEmergentDataService,
              private basicDataService: MatrixBasicDataService, private dataModelService: DataModelService) {
  }

  ngOnInit(): void {
    this.subscription = this.dataModelService.navItem$.subscribe(item => {if (item){this.loggedIn.emit(true);
                                                                                    this.loadingLogIn = false; } });
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined){
      this.subscription.unsubscribe();
    }
  }


  /**
   * login the user
   */
  public async login(): Promise<void> {

      this.loadingLogIn = true;

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
          console.log('----------------- logIn successful! ----------------');
        } else {
          console.log('logIn failed because ' + ClientError[loginResponse.getError()]);
        }
      }
  }

  /**
   * Get the error message if the password is invalid
   */
  public getPasswordErrorMessage(): string{
    return 'Please enter a password';
  }

  /**
   * Get the error message if the matrixUrl is invalid
   */
  public getMatrixUrlErrorMessage(): string{
    if (this.matrixUrlControl.hasError('required')){
      return 'Please enter a matrixUrl';
    } else {
      return 'Please enter a valid matrixUrl';
    }
  }

}
