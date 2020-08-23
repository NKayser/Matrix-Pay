import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LeaveGroupModalComponent} from './leave-group-modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Contact} from '../../DataModel/Group/Contact';
import {Group} from '../../DataModel/Group/Group';
import {Currency} from '../../DataModel/Utils/Currency';

describe('LeaveGroupModalComponent', () => {
  let component: LeaveGroupModalComponent;
  let fixture: ComponentFixture<LeaveGroupModalComponent>;
  let matDialogRef: jasmine.SpyObj<MatDialogRef<LeaveGroupModalComponent>>;

  beforeEach(async(() => {

    const spyDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ LeaveGroupModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: spyDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
    .compileComponents();

    matDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<LeaveGroupModalComponent>>;
    fixture = TestBed.createComponent(LeaveGroupModalComponent);
    component = fixture.componentInstance;
  }));

  it('cancel', () => {
    component.onCancel();
    expect(matDialogRef.close).toHaveBeenCalled();
  });

  it('confirm', () => {

    const g1 = new Group('g1', 'name_g1', Currency.USD);
    const data = {
      group: g1
    };

    component.data = data;
    component.ngOnInit();

    component.onSave();
    expect(matDialogRef.close).toHaveBeenCalledWith(data);

  });
});
