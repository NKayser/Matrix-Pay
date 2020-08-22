import {TestBed} from '@angular/core/testing';
import {DataModelService} from './data-model.service';
import {BalanceCalculatorService} from '../CalculateEmergentData/balance-calculator.service';
import {GreedyOptimisationService} from '../CalculateEmergentData/greedy-optimisation.service';
import {MatrixEmergentDataService} from '../ServerCommunication/CommunicationInterface/matrix-emergent-data.service';
import {Currency} from './Utils/Currency';
import {Language} from './Utils/Language';
import {Transaction} from './Group/Transaction';
import {TransactionType} from './Group/TransactionType';
import {AtomarChange} from './Group/AtomarChange';
import {Contact} from './Group/Contact';
import {Groupmember} from './Group/Groupmember';

describe('DataModelService', () => {

  let dataModelService: DataModelService;
  let balanceCalculatorService: jasmine.SpyObj<BalanceCalculatorService>;
  let greedyOptimisationService: jasmine.SpyObj<GreedyOptimisationService>;
  let matrixEmergentDataService: jasmine.SpyObj<MatrixEmergentDataService>;

  beforeEach(() => {
    const spyCalc = jasmine.createSpyObj('BalanceCalculatorService', ['calculateBalances']);
    const spyOpt = jasmine.createSpyObj('GreedyOptimisationService', ['getValue']);
    const spyEmerge = jasmine.createSpyObj('MatrixEmergentDataService', ['setBalances']);

    TestBed.configureTestingModule({
      // Provide both the service-to-test and its (spy) dependency
      providers: [
        DataModelService,
        {provide: BalanceCalculatorService, useValue: spyCalc},
        {provide: GreedyOptimisationService, useValue: spyOpt},
        {provide: MatrixEmergentDataService, useValue: spyEmerge}
      ]
    });
    // Inject both the service-to-test and its (spy) dependency
    dataModelService = TestBed.inject(DataModelService);
    balanceCalculatorService = TestBed.inject(BalanceCalculatorService) as jasmine.SpyObj<BalanceCalculatorService>;
    greedyOptimisationService = TestBed.inject(GreedyOptimisationService) as jasmine.SpyObj<GreedyOptimisationService>;
    matrixEmergentDataService = TestBed.inject(MatrixEmergentDataService) as jasmine.SpyObj<MatrixEmergentDataService>;
  });

  it('check init user', () => {
    dataModelService.initializeUserThisSession('c1', 'Alice', Currency.EUR, Language.ENGLISH);
    expect(dataModelService.user.contact.name).toEqual('Alice');
  });

  it('check init new user first time', () => {
    dataModelService.initializeUserFirstTime('c1', 'Alice');
    expect(dataModelService.user.currency).toEqual(Currency.EUR);
  });



  it('check groups', () => {
    const u1 = dataModelService.initializeUserThisSession('c1', 'Alice', Currency.EUR, Language.ENGLISH);
    const g1 = u1.createGroup('g1', 'name_g1', Currency.EUR);
    const g2 = u1.createGroup('g2', 'name_g2', Currency.USD);
    expect(dataModelService.getGroups().length).toBe(2);
    expect(dataModelService.getGroup('g3')).toBe(null);
    expect(dataModelService.getGroup('g1')).toBe(g1);
    expect(dataModelService.getGroup('g2')).toBe(g2);
  });

  it('check transactions', () => {
    const u1 = dataModelService.initializeUserThisSession('c1', 'Alice', Currency.EUR, Language.ENGLISH);
    const g1 = u1.createGroup('g1', 'name_g1', Currency.EUR);

    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const c3 = new Contact('c3', 'Eve');

    const d1 = new Date('December 17, 1995 03:24:00');
    const d2 = new Date('December 18, 1995 03:24:00');
    const gm1 = new Groupmember(c1, g1);
    const t1 = new Transaction(TransactionType.EXPENSE, 't1', 'name_t1', d1, g1, new AtomarChange(c1, 20),
      [new AtomarChange(c2, -15), new AtomarChange(c3, -5)], gm1);
    const t2 = new Transaction(TransactionType.PAYBACK, 't2', 'name_t2', d2, g1, new AtomarChange(c3, 5),
      [new AtomarChange(c2, -5)], gm1);

    expect(dataModelService.getTransactions('g1')).toEqual([]);
    g1.addTransaction(t1);
    g1.addTransaction(t2);
    expect(dataModelService.getTransactions('g1')).toEqual([t1, t2]);
    expect(dataModelService.getTransaction('g1', 't1')).toBe(t1);
    expect(dataModelService.getTransaction('g1', 't3000')).toBe(null);
  });

  it('check balance calculation', () => {
    const u1 = dataModelService.initializeUserThisSession('c1', 'Alice', Currency.EUR, Language.ENGLISH);
    const g1 = u1.createGroup('g1', 'name_g1', Currency.EUR);

    const c1 = new Contact('c1', 'Alice');
    const c2 = new Contact('c2', 'Bob');
    const c3 = new Contact('c3', 'Eve');

    const d1 = new Date('December 17, 1995 03:24:00');
    const d2 = new Date('December 18, 1995 03:24:00');
    const gm1 = new Groupmember(c1, g1);
    const t1 = new Transaction(TransactionType.EXPENSE, 't1', 'name_t1', d1, g1, new AtomarChange(c1, 20),
      [new AtomarChange(c2, -15), new AtomarChange(c3, -5)], gm1);
    const t2 = new Transaction(TransactionType.PAYBACK, 't2', 'name_t2', d2, g1, new AtomarChange(c3, 5),
      [new AtomarChange(c2, -5)], gm1);

    g1.addTransaction(t1);
    g1.addTransaction(t2);

    dataModelService.calculateBalances('g1', [t1, t2], 't0');
    expect(balanceCalculatorService.calculateBalances).toHaveBeenCalled();
  });

  it('check status', () => {
    dataModelService.initializeUserThisSession('c1', 'Alice', Currency.EUR, Language.ENGLISH);
    expect(dataModelService.getStatus()).not.toEqual(null);
  });

  it('check user exists', () => {
    expect(dataModelService.userExists).toEqual(false);
    dataModelService.initializeUserThisSession('c1', 'Alice', Currency.EUR, Language.ENGLISH);
    expect(dataModelService.userExists).toEqual(true);
  });

});
