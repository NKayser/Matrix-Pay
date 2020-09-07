import { TestBed } from '@angular/core/testing';

import { DialogProviderService } from './dialog-provider.service';
import {MatDialog} from '@angular/material/dialog';
import {MockDialogCancel} from './_mockServices/MockDialog';
import {Group} from '../DataModel/Group/Group';
import {Currency} from '../DataModel/Utils/Currency';
import {Transaction} from '../DataModel/Group/Transaction';
import {TransactionType} from '../DataModel/Group/TransactionType';
import {Mock} from 'protractor/built/driverProviders';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

describe('DialogProviderService', () => {

  let dialogProviderService: DialogProviderService;
  const dialog = MockDialogCancel;

  beforeEach(() => {

    TestBed.configureTestingModule({
      // Provide both the service-to-test and its (spy) dependency
      providers: [
        DialogProviderService,
        { provide: MatDialog, useValue: dialog }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    });

    dialogProviderService = TestBed.inject(DialogProviderService);
  });

  it('open error modal', () => {
    const spy = spyOn(dialog, 'open');
    dialogProviderService.openErrorModal('test_message', dialog as MatDialog);
    expect(spy).toHaveBeenCalled();
  });
});
