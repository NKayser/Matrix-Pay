import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupTransactionComponent} from './group-transaction.component';
import {MatDialog} from '@angular/material/dialog';
import {MockDialog, MockDialogCancel} from '../_mockServices/MockDialog';
import {Group} from '../../DataModel/Group/Group';
import {Currency} from '../../DataModel/Utils/Currency';
import {Transaction} from '../../DataModel/Group/Transaction';
import {TransactionType} from '../../DataModel/Group/TransactionType';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {Contact} from '../../DataModel/Group/Contact';
import {User} from '../../DataModel/User/User';
import {Language} from '../../DataModel/Utils/Language';
import {Groupmember} from '../../DataModel/Group/Groupmember';
import {AtomarChange} from '../../DataModel/Group/AtomarChange';

describe('GroupTransactionComponentCancel', () => {
  let component: GroupTransactionComponent;
  let fixture: ComponentFixture<GroupTransactionComponent>;
  let matrixBasicDataService: jasmine.SpyObj<MatrixBasicDataService>;

  beforeEach(async(() => {
    const spyMatrix = jasmine.createSpyObj('MatrixBasicDataService', ['createTransaction', 'modifyTransaction']);

    TestBed.configureTestingModule({
      declarations: [ GroupTransactionComponent ],
      providers: [
        { provide: MatDialog, useValue: MockDialogCancel },
        { provide: MatrixBasicDataService, useValue: spyMatrix},
      ]
    })
    .compileComponents();

    matrixBasicDataService = TestBed.inject(MatrixBasicDataService) as jasmine.SpyObj<MatrixBasicDataService>;

    fixture = TestBed.createComponent(GroupTransactionComponent);
    component = fixture.componentInstance;
  }));

  it('change input', () => {
    const group1 = new Group('1', '1', Currency.USD);
    group1.addTransaction(new Transaction(TransactionType.EXPENSE, 't1', 't1', null, group1, null, null, null));
    group1.addTransaction(new Transaction(TransactionType.EXPENSE, 't2', 't2', null, group1, null, null, null));

    const group2 = new Group('2', '2', Currency.USD);
    group1.addTransaction(new Transaction(TransactionType.EXPENSE, 't3', 't3', null, group1, null, null, null));

    component.group = group1;
    component.ngOnChanges();
    expect(component.group.recommendations).toEqual(group1.recommendations);

    component.group = group2;
    component.ngOnChanges();
    expect(component.group.recommendations).toEqual(group2.recommendations);
  });

  it('cancel create expense', () => {
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c1', 'Bob');
    const c3 = new Contact('c1', 'Eve');

    const g1 = new Group('g1', 'name_g1', Currency.USD);
    const mg1 = new Groupmember(c1, g1);
    g1.addGroupmember(mg1);
    const mg2 = new Groupmember(c2, g1);
    g1.addGroupmember(mg2);
    const mg3 = new Groupmember(c3, g1);
    g1.addGroupmember(mg3);

    component.group = g1;
    component.ngOnChanges();

    component.createExpense();
    expect(matrixBasicDataService.createTransaction).not.toHaveBeenCalled();
  });

  it('cancel edit expense', () => {
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c1', 'Bob');
    const c3 = new Contact('c1', 'Eve');

    const g1 = new Group('g1', 'name_g1', Currency.USD);
    const mg1 = new Groupmember(c1, g1);
    g1.addGroupmember(mg1);
    const mg2 = new Groupmember(c2, g1);
    g1.addGroupmember(mg2);
    const mg3 = new Groupmember(c3, g1);
    g1.addGroupmember(mg3);

    const t1 = new Transaction(TransactionType.EXPENSE, 't1', 'name_t1', new Date('05.05.2005'), g1,
      new AtomarChange(c1, 10),
      [
        new AtomarChange(c2, -5),
        new AtomarChange(c3, -5),
      ], mg1);

    g1.addTransaction(t1);

    component.group = g1;
    component.ngOnChanges();

    component.editExpense(t1);
    expect(matrixBasicDataService.modifyTransaction).not.toHaveBeenCalled();
  });
});

describe('GroupTransactionComponentConfirm', () => {
  let component: GroupTransactionComponent;
  let fixture: ComponentFixture<GroupTransactionComponent>;
  let matrixBasicDataService: jasmine.SpyObj<MatrixBasicDataService>;

  beforeEach(async(() => {
    const spyMatrix = jasmine.createSpyObj('MatrixBasicDataService', ['createTransaction', 'modifyTransaction']);

    TestBed.configureTestingModule({
      declarations: [ GroupTransactionComponent ],
      providers: [
        { provide: MatDialog, useValue: MockDialog },
        { provide: MatrixBasicDataService, useValue: spyMatrix},
      ]
    })
      .compileComponents();
    matrixBasicDataService = TestBed.inject(MatrixBasicDataService) as jasmine.SpyObj<MatrixBasicDataService>;

    fixture = TestBed.createComponent(GroupTransactionComponent);
    component = fixture.componentInstance;
  }));

  it('confirm create expense', () => {
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c1', 'Bob');
    const c3 = new Contact('c1', 'Eve');

    const g1 = new Group('g1', 'name_g1', Currency.USD);
    const mg1 = new Groupmember(c1, g1);
    g1.addGroupmember(mg1);
    const mg2 = new Groupmember(c2, g1);
    g1.addGroupmember(mg2);
    const mg3 = new Groupmember(c3, g1);
    g1.addGroupmember(mg3);

    component.group = g1;
    component.ngOnChanges();

    component.createExpense();
    expect(matrixBasicDataService.createTransaction).toHaveBeenCalled();
  });

  it('confirm edit expense', () => {
    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c1', 'Bob');
    const c3 = new Contact('c1', 'Eve');
    const c4 = new Contact('c1', 'Charlie');

    const g1 = new Group('g1', 'name_g1', Currency.USD);
    const mg1 = new Groupmember(c1, g1);
    g1.addGroupmember(mg1);
    const mg2 = new Groupmember(c2, g1);
    g1.addGroupmember(mg2);
    const mg3 = new Groupmember(c3, g1);
    g1.addGroupmember(mg3);
    const mg4 = new Groupmember(c4, g1);
    g1.addGroupmember(mg4);

    const t1 = new Transaction(TransactionType.EXPENSE, 't1', 'name_t1', new Date('05.05.2005'), g1,
      new AtomarChange(c1, 10),
      [
        new AtomarChange(c2, -5),
        new AtomarChange(c3, -5),
      ], mg1);

    g1.addTransaction(t1);

    component.group = g1;
    component.ngOnChanges();

    component.editExpense(t1);
    expect(matrixBasicDataService.modifyTransaction).toHaveBeenCalled();
  });
});
