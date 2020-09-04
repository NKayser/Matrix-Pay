import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBalanceComponent } from './group-balance.component';
import {MatDialog} from '@angular/material/dialog';
import {MockDialog, MockDialogCancel} from '../_mockServices/MockDialog';
import {Currency} from '../../DataModel/Utils/Currency';
import {Group} from '../../DataModel/Group/Group';
import {Recommendation} from '../../DataModel/Group/Recommendation';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {DataModelService} from '../../DataModel/data-model.service';
import {AtomarChange} from '../../DataModel/Group/AtomarChange';
import {Contact} from '../../DataModel/Group/Contact';
import {User} from '../../DataModel/User/User';
import {Language} from '../../DataModel/Utils/Language';
import {Groupmember} from '../../DataModel/Group/Groupmember';
import {EventEmitter} from '@angular/core';

describe('GroupBalanceComponent', () => {
  let component: GroupBalanceComponent;
  let fixture: ComponentFixture<GroupBalanceComponent>;

  let dataModelService: jasmine.SpyObj<DataModelService>;
  let matrixBasicDataService: jasmine.SpyObj<MatrixBasicDataService>;

  beforeEach(async(() => {

    const spyData = jasmine.createSpyObj('DataModelService', ['getUser', 'getGroups', 'getBalanceEmitter']);
    const spyMatrix = jasmine.createSpyObj('MatrixBasicDataService', ['createTransaction']);

    TestBed.configureTestingModule({
      declarations: [ GroupBalanceComponent ],
      providers: [
        { provide: MatDialog, useValue: MockDialogCancel },
        { provide: MatrixBasicDataService, useValue: spyMatrix},
        { provide: DataModelService, useValue: spyData}
      ]
    })
    .compileComponents();

    dataModelService = TestBed.inject(DataModelService) as jasmine.SpyObj<DataModelService>;
    matrixBasicDataService = TestBed.inject(MatrixBasicDataService) as jasmine.SpyObj<MatrixBasicDataService>;
    dataModelService.getBalanceEmitter.and.returnValue({
      subscribe(): any {

      }
    } as EventEmitter<void>);

    fixture = TestBed.createComponent(GroupBalanceComponent);
    component = fixture.componentInstance;
  }));

  it('check for input', () => {
    const c1 = new Contact('c1', 'Alice');
    const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
    dataModelService.getUser.and.returnValue(stubValueUser);
    const g1 = new Group('1', '1', Currency.USD);
    g1.setRecommendations([new Recommendation(g1, null, null)]);
    const g2 = new Group('2', '2', Currency.USD);
    g2.setRecommendations([new Recommendation(g2, null, null)]);
    const mg1 = new Groupmember(c1, g1);
    mg1.balance = 5;
    g1.addGroupmember(mg1);
    const mg2 = new Groupmember(c1, g2);
    mg2.balance = 10;
    g2.addGroupmember(mg2);

    component.group = g1;
    component.ngOnChanges();
    expect(component.recommendations).toEqual(g1.recommendations);
    expect(component.userContact).toBe(c1);

    component.group = g2;
    component.ngOnChanges();
    expect(component.recommendations).toEqual(g2.recommendations);
    expect(component.userContact).toBe(c1);
  });

  it('cancel recommendation', () => {
    component.recommendations = [new Recommendation(new Group('1', '1', Currency.USD),
      new AtomarChange(new Contact('c1', 'name_c1'), 5),
      new AtomarChange(new Contact('c2', 'name_c2'), -5))];
    component.confirmPayback(0);
    expect(matrixBasicDataService.createTransaction).not.toHaveBeenCalled();
  });

  it('cancel balance color', () => {
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const c3 = new Contact('c3', 'Eve');
    const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
    dataModelService.getUser.and.returnValue(stubValueUser);
    const g1 = new Group('1', '1', Currency.USD);
    g1.setRecommendations([new Recommendation(g1, null, null)]);
    const mg1 = new Groupmember(c1, g1);
    mg1.balance = 5;
    g1.addGroupmember(mg1);
    const mg2 = new Groupmember(c2, g1);
    mg2.balance = -5;
    g1.addGroupmember(mg2);
    const mg3 = new Groupmember(c3, g1);
    mg3.balance = 0;
    g1.addGroupmember(mg3);

    component.group = g1;
    component.ngOnChanges();

    expect(component.getCustomColor(c1.name)).toBe('green');
    expect(component.getCustomColor(c2.name)).toBe('red');
    expect(component.getCustomColor(c3.name)).toBe('green');


  });

  it('onresize check', () => {
    component.onResize({target: {innerWidth: 800}});
    expect(component.breakpoint).toEqual(2);
    component.onResize({target: {innerWidth: 100}});
    expect(component.breakpoint).toEqual(1);
    component.onResize({target: {innerWidth: 1920}});
    expect(component.breakpoint).toEqual(3);
    component.onResize({target: {innerWidth: 540}});
    expect(component.breakpoint).toEqual(1);
  });


});

describe('GroupBalanceComponent', () => {
  let component: GroupBalanceComponent;
  let fixture: ComponentFixture<GroupBalanceComponent>;

  let dataModelService: jasmine.SpyObj<DataModelService>;
  let matrixBasicDataService: jasmine.SpyObj<MatrixBasicDataService>;

  beforeEach(async(() => {

    const spyData = jasmine.createSpyObj('DataModelService', ['getUser', 'getGroups']);
    const spyMatrix = jasmine.createSpyObj('MatrixBasicDataService', ['createTransaction']);

    TestBed.configureTestingModule({
      declarations: [ GroupBalanceComponent ],
      providers: [
        { provide: MatDialog, useValue: MockDialog },
        { provide: MatrixBasicDataService, useValue: spyMatrix},
        { provide: DataModelService, useValue: spyData}
      ]
    })
      .compileComponents();

    dataModelService = TestBed.inject(DataModelService) as jasmine.SpyObj<DataModelService>;
    matrixBasicDataService = TestBed.inject(MatrixBasicDataService) as jasmine.SpyObj<MatrixBasicDataService>;

    fixture = TestBed.createComponent(GroupBalanceComponent);
    component = fixture.componentInstance;
  }));

  it('confirm recommendation', () => {
    component.recommendations = [new Recommendation(new Group('1', '1', Currency.USD),
      new AtomarChange(new Contact('c1', 'name_c1'), 5),
      new AtomarChange(new Contact('c2', 'name_c2'), -5))];
    component.confirmPayback(0);
    expect(matrixBasicDataService.createTransaction).toHaveBeenCalled();
  });
});
