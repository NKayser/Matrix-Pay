import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroupModalComponent } from './create-group-modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Currency} from '../../DataModel/Utils/Currency';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('CreateGroupModalComponent', () => {
  let component: CreateGroupModalComponent;
  let fixture: ComponentFixture<CreateGroupModalComponent>;

  let matDialogRef: jasmine.SpyObj<MatDialogRef<CreateGroupModalComponent>>;

  beforeEach(async(() => {

    const spyDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [ CreateGroupModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: spyDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();

    matDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<CreateGroupModalComponent>>;
    fixture = TestBed.createComponent(CreateGroupModalComponent);
    component = fixture.componentInstance;
  }));

  it('cancel', () => {
    component.onCancel();
    expect(matDialogRef.close).toHaveBeenCalled();
  });

  it('check error messages', () => {
    expect(component.getInvalidGroupNameErrorMessage()).toEqual('Please enter a group name');
  });

  it('confirm', () => {

    const data = {
      groupName: 'name_g1',
      currency: Currency.USD
    };

    component.data = data;
    component.ngOnInit();

    component.onSave();
    expect(matDialogRef.close).toHaveBeenCalledWith(data);

  });

  it('confirm invalid group', () => {

    const data = {
      groupName: '',
      currency: Currency.USD
    };

    component.data = data;
    component.ngOnInit();

    component.onSave();
    expect(matDialogRef.close).not.toHaveBeenCalled();

  });
});
