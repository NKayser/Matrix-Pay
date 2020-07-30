import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Manages if the password is shown in the view
  hide = true;

  // Saves password and matrixUrl in the input form
  matrixUrl = '';
  password = '';

  constructor() { }

  ngOnInit(): void {
  }

  // login the user with the current values if matrixUrl and password
  login(): void{
      console.log(this.matrixUrl + ' ' + this.password);
  }

}
