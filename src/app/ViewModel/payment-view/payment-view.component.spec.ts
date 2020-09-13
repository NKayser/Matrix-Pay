import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PaymentViewComponent} from './payment-view.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Contact} from '../../DataModel/Group/Contact';
import {Currency} from '../../DataModel/Utils/Currency';

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
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
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


  it('init', () => {

    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('2', 'Bob');

    component.data = {
      modalTitle: 't1',
      description: 't1',
      payer: c1,
      recipients: [c1, c2],
      amount: [0, 5],
      isAdded: [false, true],
      currency: Currency.EUR
    };
    component.ngOnInit();
    expect(component.data.modalTitle).toEqual('t1');
    expect(component.data.description).toEqual('t1');
    expect(component.data.payer).toEqual(c1);
    expect(component.data.recipients).toEqual([c2]);
    expect(component.data.amount).toEqual([5]);
    expect(component.data.currency).toEqual(Currency.EUR);
  });
});
