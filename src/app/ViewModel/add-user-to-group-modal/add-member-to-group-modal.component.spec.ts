import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberToGroupModalComponent } from './add-member-to-group-modal.component';

describe('AddUserToGroupModalComponent', () => {
  let component: AddMemberToGroupModalComponent;
  let fixture: ComponentFixture<AddMemberToGroupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemberToGroupModalComponent ]
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
