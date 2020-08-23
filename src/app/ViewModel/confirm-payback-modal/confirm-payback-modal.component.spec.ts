import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfirmPaybackModalComponent} from './confirm-payback-modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Currency} from '../../DataModel/Utils/Currency';
import {Recommendation} from '../../DataModel/Group/Recommendation';
import {Contact} from '../../DataModel/Group/Contact';
import {Group} from '../../DataModel/Group/Group';
import {AtomarChange} from '../../DataModel/Group/AtomarChange';

describe('ConfirmPaybackModalComponent', () => {
  let component: ConfirmPaybackModalComponent;
  let fixture: ComponentFixture<ConfirmPaybackModalComponent>;

  let matDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmPaybackModalComponent>>;

  beforeEach(async(() => {
    const spyDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ ConfirmPaybackModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: spyDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
    .compileComponents();

    matDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ConfirmPaybackModalComponent>>;
    fixture = TestBed.createComponent(ConfirmPaybackModalComponent);
    component = fixture.componentInstance;
  }));

  it('cancel', () => {
    component.onCancel();
    expect(matDialogRef.close).toHaveBeenCalled();
  });

  it('confirm', () => {

    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const g1 = new Group('g1', 'name_g1', Currency.EUR);

    const data = {
      recommendation: new Recommendation(g1, new AtomarChange(c1, 5), new AtomarChange(c2, -5))
    };

    component.data = data;

    component.onSave();
    expect(matDialogRef.close).toHaveBeenCalledWith(data);

  });
});
