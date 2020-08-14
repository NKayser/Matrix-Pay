import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPaybackModalComponent } from './confirm-payback-modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

describe('ConfirmPaybackModalComponent', () => {
  let component: ConfirmPaybackModalComponent;
  let fixture: ComponentFixture<ConfirmPaybackModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPaybackModalComponent ],
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
    fixture = TestBed.createComponent(ConfirmPaybackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
