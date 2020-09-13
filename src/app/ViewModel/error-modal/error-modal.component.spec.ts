import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorModalComponent } from './error-modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('ErrorModalComponent', () => {
  let component: ErrorModalComponent;
  let fixture: ComponentFixture<ErrorModalComponent>;
  let matDialogRef: jasmine.SpyObj<MatDialogRef<ErrorModalComponent>>;

  beforeEach(async(() => {

    const spyDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ ErrorModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: spyDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();

    matDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ErrorModalComponent>>;
    fixture = TestBed.createComponent(ErrorModalComponent);
    component = fixture.componentInstance;
  }));

  it('cancel', () => {
    component.onCancel();
    expect(matDialogRef.close).toHaveBeenCalled();
  });
});
