import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryComponent } from './history.component';
import {MatDialog} from '@angular/material/dialog';
import {MockDialog} from '../_mockServices/MockDialog';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {DataModelService} from '../../DataModel/data-model.service';
import {Group} from '../../DataModel/Group/Group';
import {Currency} from '../../DataModel/Utils/Currency';
import {Activity} from '../../DataModel/Group/Activity';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryComponent ]
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

    console.log(g1.activities);

    component.group = g1;
    component.ngOnChanges();
    console.log(component.activities);
    expect(component.activities).toEqual([a1, a2]);

    component.group = g2;
    component.ngOnChanges();
    console.log(component.activities);
    expect(component.activities).toEqual([a3, a4]);

  });
});
