import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberToGroupModalComponent } from './add-member-to-group-modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

describe('AddUserToGroupModalComponent', () => {
  let component: AddMemberToGroupModalComponent;
  let fixture: ComponentFixture<AddMemberToGroupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemberToGroupModalComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: []
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: []
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberToGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
