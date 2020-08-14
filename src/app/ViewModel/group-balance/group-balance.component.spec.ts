import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBalanceComponent } from './group-balance.component';
import {MatDialog} from '@angular/material/dialog';

describe('GroupBalanceComponent', () => {
  let component: GroupBalanceComponent;
  let fixture: ComponentFixture<GroupBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupBalanceComponent ],
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
    fixture = TestBed.createComponent(GroupBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
