import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {MatDialog} from '@angular/material/dialog';
import {Recommendation} from '../../DataModel/Group/Recommendation';
import {MockDialog, MockDialogCancel} from '../_mockServices/MockDialog';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {DataModelService} from '../../DataModel/data-model.service';
import {Group} from '../../DataModel/Group/Group';
import {Currency} from '../../DataModel/Utils/Currency';
import {User} from '../../DataModel/User/User';
import {Language} from '../../DataModel/Utils/Language';
import {Contact} from '../../DataModel/Group/Contact';
import {Groupmember} from '../../DataModel/Group/Groupmember';
import {AtomarChange} from '../../DataModel/Group/AtomarChange';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

describe('HomeComponentCancel', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let dataModelService: jasmine.SpyObj<DataModelService>;
  let matrixBasicDataService: jasmine.SpyObj<MatrixBasicDataService>;

  beforeEach(async(() => {

    const spyData = jasmine.createSpyObj('DataModelService', ['getUser', 'getGroups', 'getBalanceEmitter']);
    const spyMatrix = jasmine.createSpyObj('MatrixBasicDataService', ['createTransaction']);

    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [
        { provide: MatDialog, useValue: MockDialogCancel },
        { provide: MatrixBasicDataService, useValue: spyMatrix},
        { provide: DataModelService, useValue: spyData}
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();

    dataModelService = TestBed.inject(DataModelService) as jasmine.SpyObj<DataModelService>;
    matrixBasicDataService = TestBed.inject(MatrixBasicDataService) as jasmine.SpyObj<MatrixBasicDataService>;

    dataModelService.getBalanceEmitter.and.returnValue({subscribe(): Subscription{ return new Subscription(); } } as Observable<void>);

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  }));

  it('cancel recommendation', () => {
    component.recommendations = [new Recommendation(new Group('1', '1', Currency.USD),
      new AtomarChange(new Contact('c1', 'name_c1'), 5),
      new AtomarChange(new Contact('c2', 'name_c2'), -5))];
    component.confirmPayback(0);
    expect(matrixBasicDataService.createTransaction).not.toHaveBeenCalled();
  });
  it('init recommendation', () => {
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const g1 = new Group('g1', 'name_g1', Currency.EUR);
    const gm1 = new Groupmember(c1, g1);
    const gm2 = new Groupmember(c2, g1);
    g1.addGroupmember(gm1);
    g1.addGroupmember(gm2);
    const r1 = new Recommendation(g1, new AtomarChange(c1, 100), new AtomarChange(c2, -100));
    g1.setRecommendations([r1]);
    dataModelService.getUser.and.returnValue(new User(c1, Currency.EUR, Language.ENGLISH));
    dataModelService.getGroups.and.returnValue([g1]);

    fixture.detectChanges();

    expect(component.recommendations).toEqual([r1]);
  });


  it('onresize check', () => {
    component.onResize({target: {innerWidth: 800}});
    expect(component.breakpoint).toEqual(2);
    component.onResize({target: {innerWidth: 100}});
    expect(component.breakpoint).toEqual(1);
    component.onResize({target: {innerWidth: 1920}});
    expect(component.breakpoint).toEqual(4);
    component.onResize({target: {innerWidth: 540}});
    expect(component.breakpoint).toEqual(1);
  });

  it('calculate total Balances', () => {
    const c1 = new Contact('c1', 'Alice');
    const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
    dataModelService.getUser.and.returnValue(stubValueUser);

    const g1 = new Group('g1', 'name_g1', Currency.USD);
    const g2 = new Group('g2', 'name_g2', Currency.USD);
    const g3 = new Group('g3', 'name_g3', Currency.EUR);
    const g4 = new Group('g4', 'name_g4', Currency.EUR);

    const mg1 = new Groupmember(c1, g1);
    mg1.balance = 5;
    g1.addGroupmember(mg1);
    const mg2 = new Groupmember(c1, g2);
    mg2.balance = 10;
    g2.addGroupmember(mg2);
    const mg3 = new Groupmember(c1, g3);
    mg3.balance = 7;
    g3.addGroupmember(mg3);
    const mg4 = new Groupmember(c1, g4);
    mg4.balance = 6;
    g4.addGroupmember(mg4);

    const stubValueGroups = [g1, g2, g3, g4];

    dataModelService.getGroups.and.returnValue(stubValueGroups);

    fixture.detectChanges();

    expect(component.getTotalBalance(Currency.USD)).toBe(15);
    expect(component.getTotalBalance(Currency.EUR)).toBe(13);
  });

});

describe('HomeComponentConfirm', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let dataModelService: jasmine.SpyObj<DataModelService>;
  let matrixBasicDataService: jasmine.SpyObj<MatrixBasicDataService>;

  beforeEach(async(() => {

    const spyData = jasmine.createSpyObj('DataModelService', ['getUser', 'getGroups']);
    const spyMatrix = jasmine.createSpyObj('MatrixBasicDataService', ['createTransaction']);

    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      providers: [
        { provide: MatDialog, useValue: MockDialog },
        { provide: MatrixBasicDataService, useValue: spyMatrix},
        { provide: DataModelService, useValue: spyData}
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
      .compileComponents();

    dataModelService = TestBed.inject(DataModelService) as jasmine.SpyObj<DataModelService>;
    matrixBasicDataService = TestBed.inject(MatrixBasicDataService) as jasmine.SpyObj<MatrixBasicDataService>;

    fixture = TestBed.createComponent(HomeComponent);
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
