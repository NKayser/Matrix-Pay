import {Component, EventEmitter, Output} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {MatrixClientService} from '../../ServerCommunication/CommunicationInterface/matrix-client.service';
import {openErrorModal, promiseTimeout, TIMEOUT} from '../promiseTimeout';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.css']
})
export class NavigationMenuComponent {

  // Emitter to tell AppComponent that the user is logged out
  @Output() loggedOut = new EventEmitter<boolean>();

  public loadingLogout = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private matrixClientService: MatrixClientService, public dialog: MatDialog) {}

  /**
   * Send output if the user logged out
   */
  public logout(): void{

    this.loadingLogout = true;
    promiseTimeout(TIMEOUT, this.matrixClientService.logout())
      .then((data) => {
        if (!data.wasSuccessful()){
          openErrorModal('error logout 1: ' + data.getMessage(), this.dialog);
        } else {
          this.loggedOut.emit(false);
        }
        this.loadingLogout = false;
      }, (err) => {
        openErrorModal('error logout 2: ' + err, this.dialog);
        this.loadingLogout = false;
      });
  }

}
