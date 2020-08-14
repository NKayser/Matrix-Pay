import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTransactionComponent } from './group-transaction.component';
import {MatDialog} from '@angular/material/dialog';

describe('GroupTransactionComponent', () => {
  let component: GroupTransactionComponent;
  let fixture: ComponentFixture<GroupTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupTransactionComponent ],
      providers: [
        {
          provide: MatDialog,
          useValue: []
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
