import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentViewComponent } from './payment-view.component';
import {PaymentModalComponent} from '../payment-modal/payment-modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

describe('PaymentViewComponent', () => {
  let component: PaymentViewComponent;
  let fixture: ComponentFixture<PaymentViewComponent>;

  let matDialogRef: jasmine.SpyObj<MatDialogRef<PaymentViewComponent>>;

  beforeEach(async(() => {

    const spyDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ PaymentViewComponent ],
      providers: [
        { provide: MatDialogRef, useValue: spyDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
        .compileComponents();


    matDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<PaymentViewComponent>>;
    fixture = TestBed.createComponent(PaymentViewComponent);
    component = fixture.componentInstance;

  }));

  it('cancel', () => {
    component.onCancel();
    expect(matDialogRef.close).toHaveBeenCalled();
  });
});
