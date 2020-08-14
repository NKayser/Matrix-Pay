import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroupModalComponent } from './create-group-modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

describe('CreateGroupModalComponent', () => {
  let component: CreateGroupModalComponent;
  let fixture: ComponentFixture<CreateGroupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGroupModalComponent ],
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
    fixture = TestBed.createComponent(CreateGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
