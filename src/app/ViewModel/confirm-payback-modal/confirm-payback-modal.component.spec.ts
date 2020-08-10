import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPaybackModalComponent } from './confirm-payback-modal.component';

describe('ConfirmPaybackModalComponent', () => {
  let component: ConfirmPaybackModalComponent;
  let fixture: ComponentFixture<ConfirmPaybackModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPaybackModalComponent ]
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
