import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {BasicDataUpdateService} from "./Update/basic-data-update.service";
import {EmergentDataUpdateService} from "./Update/emergent-data-update.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular-MatrixMicroPayments-App';
  loggedIn = false;

  constructor(private router: Router,
              private updateBasicData: BasicDataUpdateService,
              private updateEmergentData: EmergentDataUpdateService) { }

  /**
   * Manage that correct site is shown when user gets logged out
   */
  public logout(): void{
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }

  /**
   * Manage that correct site is shown when user gets logged in
   */
  public login(): void{
    this.loggedIn = true;
    this.router.navigate(['/home']);
  }
}
