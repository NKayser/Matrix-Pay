import {Component, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatrixClientService} from '../../ServerCommunication/CommunicationInterface/matrix-client.service';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {DataModelService} from '../../DataModel/data-model.service';
import {Subscription} from 'rxjs';

// @ts-ignore
import {MatrixEvent} from 'matrix-js-sdk';
import {promiseTimeout, TIMEOUT} from '../promiseTimeout';
import {DialogProviderService} from '../dialog-provider.service';
import {MatDialog} from '@angular/material/dialog';



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
  public autoLogin = false;

  private subscription: Subscription;

  // gets the input values of the user and checks if they obey all requirements
  public matrixUrlControl = new FormControl('', [Validators.required, Validators.pattern('@[_a-z0-9-]+:[a-z0-9.-]+')]);
  public passwordControl = new FormControl('', [Validators.required]);

  constructor(private clientService: MatrixClientService,
              private basicDataService: MatrixBasicDataService, private dataModelService: DataModelService,
              private dialogProviderService: DialogProviderService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.subscription = this.dataModelService.navItem$.subscribe(item => {if (item){this.loggedIn.emit(true);
                                                                                    this.loadingLogIn = false; } });

    const account = localStorage.getItem('account');
    const accessToken = localStorage.getItem('accessToken');

    if (account !== null && accessToken !== null){
      this.autoLogin = true;
      promiseTimeout(TIMEOUT, this.clientService.login(account, undefined, accessToken))
          .then((data) => {
            if (!data.wasSuccessful()){
              this.clientService.logout().then(() => {this.autoLogin = false; }, (err) => {this.autoLogin = false; });
              this.dialogProviderService.openErrorModal('error login 1: ' + data.getMessage(), this.dialog);
            } else {
              // this.autoLogin = false;
            }
          }, (err) => {
            this.clientService.logout().then(() => {this.autoLogin = false; }, (err1) => {this.autoLogin = false; });
            this.dialogProviderService.openErrorModal('error login 2: ' + err, this.dialog);
          });
    }

  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined){
      this.subscription.unsubscribe();
    }
  }



  /*public async login(): Promise<void> {

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
  }*/

  /**
   * login the user
   */
  public login(): void {

    if (this.loadingLogIn || this.passwordControl.invalid || this.matrixUrlControl.invalid) {
      return;
    }

    this.loadingLogIn = true;

    // check all formControls to make sure all values are correct
    this.matrixUrlControl.markAllAsTouched();
    this.passwordControl.markAllAsTouched();

    // check if any values are incorrect, if no pass them to the service
    if (!this.matrixUrlControl.invalid && !this.passwordControl.invalid){

      promiseTimeout(TIMEOUT, this.clientService.login(this.matrixUrlControl.value, this.passwordControl.value))
          .then((data) => {
            if (!data.wasSuccessful()){
              this.clientService.logout().then(() => {this.loadingLogIn = false; }, (err) => {this.loadingLogIn = false; });
              this.dialogProviderService.openErrorModal('error login 1: ' + data.getMessage(), this.dialog);
            } else {
              // this.loadingLogIn = false;
            }
          }, (err) => {
            this.clientService.logout().then(() => {this.loadingLogIn = false; }, (err1) => {this.loadingLogIn = false; });
            this.dialogProviderService.openErrorModal('error login 2: ' + err, this.dialog);
          });
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
