import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryComponent } from './history.component';
import {Group} from '../../DataModel/Group/Group';
import {Currency} from '../../DataModel/Utils/Currency';
import {Activity} from '../../DataModel/Group/Activity';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {ReversePipePipe} from '../reverse-pipe.pipe';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryComponent, ReversePipePipe],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
  }));

  it('change test', () => {

    const g1 = new Group('g1', 'name_g1', Currency.USD);
    const g2 = new Group('g2', 'name_g2', Currency.USD);

    const a1 = new Activity(null, null, null, null);
    const a2 = new Activity(null, null, null, null);
    const a3 = new Activity(null, null, null, null);
    const a4 = new Activity(null, null, null, null);
    g1.addActivity(a1);
    g1.addActivity(a2);
    g2.addActivity(a3);
    g2.addActivity(a4);

    component.group = g1;
    component.ngOnChanges();
    expect(component.activities).toEqual([a1, a2]);

    component.group = g2;
    component.ngOnChanges();
    expect(component.activities).toEqual([a3, a4]);

  });
});
