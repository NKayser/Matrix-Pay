import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberToGroupModalComponent } from './add-member-to-group-modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Currency} from '../../DataModel/Utils/Currency';
import {Group} from '../../DataModel/Group/Group';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('AddUserToGroupModalComponent', () => {
  let component: AddMemberToGroupModalComponent;
  let fixture: ComponentFixture<AddMemberToGroupModalComponent>;
  let matDialogRef: jasmine.SpyObj<MatDialogRef<AddMemberToGroupModalComponent>>;

  beforeEach(async(() => {

    const spyDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [ AddMemberToGroupModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: spyDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();


    matDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AddMemberToGroupModalComponent>>;
    fixture = TestBed.createComponent(AddMemberToGroupModalComponent);
    component = fixture.componentInstance;
  }));

  it('cancel', () => {
    component.onCancel();
    expect(matDialogRef.close).toHaveBeenCalled();
  });

  it('check error messages', () => {
    expect(component.getInvalidUserErrorMessage()).toEqual('Not a valid user name');
  });

  it('confirm', () => {

    const g1 = new Group('g1', 'name_g1', Currency.EUR);

    const data = {
      group: g1,
      user: '@username:host'
    };

    component.data = data;
    component.ngOnInit();

    component.onSave();
    expect(matDialogRef.close).toHaveBeenCalledWith(data);

  });

  it('confirm invalid user', () => {

    const g1 = new Group('g1', 'name_g1', Currency.EUR);

    component.data = {
      group: g1,
      user: 'u1'
    };
    component.ngOnInit();

    component.onSave();
    expect(matDialogRef.close).not.toHaveBeenCalled();

  });
});
