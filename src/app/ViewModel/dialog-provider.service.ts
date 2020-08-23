import { Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ErrorModalComponent} from './error-modal/error-modal.component';

@Injectable({
  providedIn: 'root'
})
export class DialogProviderService {

  constructor() { }

   openErrorModal(message: string, dialog: MatDialog){
    dialog.open(ErrorModalComponent, {
      width: '300px',
      data: {errorMessage: message}
    });
  }
}
