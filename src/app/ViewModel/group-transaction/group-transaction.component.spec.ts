import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupTransactionComponent} from './group-transaction.component';
import {MatDialog} from '@angular/material/dialog';
import {MockDialog} from '../_mockServices/MockDialog';
import {DataModelService} from '../../DataModel/data-model.service';
import {MockDataModelService} from '../_mockServices/MockDataModelService';
import {Group} from '../../DataModel/Group/Group';
import {Currency} from '../../DataModel/Utils/Currency';
import {Transaction} from '../../DataModel/Group/Transaction';
import {TransactionType} from '../../DataModel/Group/TransactionType';
import {MatrixBasicDataService} from '../../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {MockMatrixBasicDataService} from '../_mockServices/MockMatrixBasicDataService';

describe('GroupTransactionComponent', () => {
  let component: GroupTransactionComponent;
  let fixture: ComponentFixture<GroupTransactionComponent>;
  let dataModelService: DataModelService;
  let matrixBasicDataService: MatrixBasicDataService;
  // let spy1: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupTransactionComponent ],
      providers: [
        { provide: MatDialog, useValue: MockDialog },
        { provide: DataModelService, useClass: MockDataModelService },
        { provide: MatrixBasicDataService, useClass: MockMatrixBasicDataService },
      ]
    })
    .compileComponents();

    dataModelService = TestBed.inject(DataModelService);
    matrixBasicDataService = TestBed.inject(MatrixBasicDataService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

  /*it('create expense', () => {
    const group1 = new Group('1', '1', Currency.USD);
    group1.addTransaction(new Transaction(TransactionType.EXPENSE, 't1', 't1', null, group1, null, null, null));
    group1.addTransaction(new Transaction(TransactionType.EXPENSE, 't2', 't2', null, group1, null, null, null));
    component.group = group1;

    component.ngOnChanges();
    spy1 = spyOn(transactionService, 'createTransaction');
    component.createExpense();
    expect(spy1).toHaveBeenCalled();

  });*/
});
