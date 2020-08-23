import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModalComponent } from './payment-modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Contact} from '../../DataModel/Group/Contact';

describe('PaymentModalComponent', () => {
  let component: PaymentModalComponent;
  let fixture: ComponentFixture<PaymentModalComponent>;

  let matDialogRef: jasmine.SpyObj<MatDialogRef<PaymentModalComponent>>;

  beforeEach(async(() => {

    const spyDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ PaymentModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: spyDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
    .compileComponents();


    matDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<PaymentModalComponent>>;
    fixture = TestBed.createComponent(PaymentModalComponent);
    component = fixture.componentInstance;

  }));

  it('cancel', () => {
    component.onCancel();
    expect(matDialogRef.close).toHaveBeenCalled();
  });

  it('confirm', () => {

    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const c3 = new Contact('c2', 'Bob');
    const amountArray = [3, 4, 7];
    const data = {
      modalTitle: 'testModal',
      description: 'TestDescription',
      payer: c1,
      recipients: [c1, c2, c3],
      amount: amountArray,
      isAdded: [true, true, true]
    };

    component.data = data;
    component.ngOnInit();

    component.onSave();
    expect(matDialogRef.close).toHaveBeenCalledWith(data);

  });

  it('check modal description error', () => {

    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const c3 = new Contact('c2', 'Bob');
    const amountArray = [3, 4, 7];
    const data = {
      modalTitle: 'testModal',
      description: '',
      payer: c1,
      recipients: [c1, c2, c3],
      amount: amountArray,
      isAdded: [true, true, true]
    };

    component.data = data;
    component.ngOnInit();

    component.onSave();
    expect(matDialogRef.close).not.toHaveBeenCalledWith(data);

  });

  it('check user Amount error', () => {

    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const c3 = new Contact('c2', 'Bob');
    const amountArray = [3, 4.55555, 7];
    const data = {
      modalTitle: 'testModal',
      description: '',
      payer: c1,
      recipients: [c1, c2, c3],
      amount: amountArray,
      isAdded: [true, true, true]
    };

    component.data = data;
    component.ngOnInit();

    component.onSave();
    expect(matDialogRef.close).not.toHaveBeenCalledWith(data);

  });

  it('check error messages', () => {
    expect(component.getInvalidNumberErrorMessage()).toEqual('Not a valid number');
    expect(component.getInvalidDescriptionErrorMessage()).toEqual('Not a description');
    expect(component.getInvalidFormErrorMessage()).toEqual('Not all inputs are valid');
  });
});
