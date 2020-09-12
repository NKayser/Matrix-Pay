import {BasicDataUpdateService} from '../Update/basic-data-update.service';
import {DataModelService} from '../DataModel/data-model.service';
import {Subject} from 'rxjs';
import {
  CurrencyType,
  GroupActivityType,
  GroupMemberType,
  GroupsType,
  LanguageType,
  TransactionType as TransactionTypeInterface,
  UserType
} from '../ServerCommunication/CommunicationInterface/parameterTypes';
import {ObservableService} from '../ServerCommunication/CommunicationInterface/observable.service';
import {BalanceCalculatorService} from '../CalculateEmergentData/balance-calculator.service';
import {GreedyOptimisationService} from '../CalculateEmergentData/greedy-optimisation.service';
import {Recommendation} from '../DataModel/Group/Recommendation';
import {AtomarChange} from '../DataModel/Group/AtomarChange';

/**
 * This Integration test class tests BasicDataUpdateService and DataModelService while mocking ObservableService
 */
describe('BasicDataUpdateService, DataModel and CalculateEmergentData', () => {
  let dataModel: DataModelService;
  let updateService: BasicDataUpdateService;
  let balanceCalculator: BalanceCalculatorService;
  let greedyOptimisation: GreedyOptimisationService;

  const mockedObservableService = jasmine.createSpyObj('ObservableService',
    ['getUserObservable', 'getGroupsObservable', 'getGroupActivityObservable', 'getSettingsLanguageObservable',
      'getSettingsCurrencyObservable', 'getGroupMembershipObservable', 'getMultipleNewTransactionsObservable', 'getLogoutObservable']);

  beforeEach(() => {
    balanceCalculator = new BalanceCalculatorService();
    greedyOptimisation = new GreedyOptimisationService();
    dataModel = new DataModelService(balanceCalculator, greedyOptimisation);

    const userObservable: Subject<UserType> = new Subject<UserType>();
    mockedObservableService.getUserObservable.and.returnValue(userObservable);

    const groupsObservable: Subject<GroupsType> = new Subject<GroupsType>();
    mockedObservableService.getGroupsObservable.and.returnValue(groupsObservable);

    const groupActivityObservable: Subject<GroupActivityType> = new Subject<GroupActivityType>();
    mockedObservableService.getGroupActivityObservable.and.returnValue(groupActivityObservable);

    const languageObservable: Subject<LanguageType> = new Subject<LanguageType>();
    mockedObservableService.getSettingsLanguageObservable.and.returnValue(languageObservable);

    const currencyObservable: Subject<CurrencyType> = new Subject<CurrencyType>();
    mockedObservableService.getSettingsCurrencyObservable.and.returnValue(currencyObservable);

    const groupmemberObservable: Subject<GroupMemberType> = new Subject<GroupMemberType>();
    mockedObservableService.getGroupMembershipObservable.and.returnValue(groupmemberObservable);

    const transactionsObservable: Subject<TransactionTypeInterface[]> = new Subject<TransactionTypeInterface[]>();
    mockedObservableService.getMultipleNewTransactionsObservable.and.returnValue(transactionsObservable);

    const logoutObservable: Subject<void> = new Subject<void>();
    mockedObservableService.getLogoutObservable.and.returnValue(logoutObservable);

    updateService = new BasicDataUpdateService(mockedObservableService, dataModel);
  });

  it( 'should create a number of transactions and calculate balances', () => {
    // Setup
    mockedObservableService.getGroupsObservable().next({groupId: 'id007', groupName: 'Urlaub', currency: 'USD', userIds: [],
      userNames: [], isLeave: false});
    mockedObservableService.getGroupMembershipObservable().next({groupId: 'id007', userId: 'memId001', name: 'Markus',
      isLeave: false, date: new Date(100)});
    mockedObservableService.getGroupMembershipObservable().next({groupId: 'id007', userId: 'memId002', name: 'Marion',
      isLeave: false, date: new Date(200)});
    mockedObservableService.getGroupMembershipObservable().next({groupId: 'id007', userId: 'memId003', name: 'Nico',
      isLeave: false, date: new Date(300)});
    // Precondition
    expect(dataModel.getGroup('id007').getTransaction('transId001')).toEqual(null);
    // Actual
    const transaction = {transactionType: 'EXPENSE', transactionId: 'transId001', name: 'Essen', creationDate: new Date(400),
      groupId: 'id007', payerId: 'memId001', payerAmount: 500, recipientIds: ['memId002'], recipientAmounts: [500], senderId: 'memId003'};
    const transaction2 = {transactionType: 'EXPENSE', transactionId: 'transId002', name: 'Essen2', creationDate: new Date(500),
      groupId: 'id007', payerId: 'memId003', payerAmount: 299, recipientIds: ['memId001', 'memId002', 'memId003'],
      recipientAmounts: [40, 199, 60], senderId: 'memId003'};
    mockedObservableService.getMultipleNewTransactionsObservable().next([transaction, transaction2]);
    expect(dataModel.getGroup('id007').getTransaction('transId001')).not.toEqual(null);
    expect(dataModel.getGroup('id007').getTransaction('transId002')).not.toEqual(null);
    expect(dataModel.getGroup('id007').getGroupmember('memId001').balance).toEqual(460);
    expect(dataModel.getGroup('id007').getGroupmember('memId002').balance).toEqual(-699);
    expect(dataModel.getGroup('id007').getGroupmember('memId003').balance).toEqual(239);
  });

  it( 'should create a number of transactions and optimize payback', () => {
    // Setup
    mockedObservableService.getGroupsObservable().next({groupId: 'id007', groupName: 'Urlaub', currency: 'USD', userIds: [],
      userNames: [], isLeave: false});
    mockedObservableService.getGroupMembershipObservable().next({groupId: 'id007', userId: 'memId001', name: 'Markus',
      isLeave: false, date: new Date(100)});
    mockedObservableService.getGroupMembershipObservable().next({groupId: 'id007', userId: 'memId002', name: 'Marion',
      isLeave: false, date: new Date(200)});
    mockedObservableService.getGroupMembershipObservable().next({groupId: 'id007', userId: 'memId003', name: 'Nico',
      isLeave: false, date: new Date(300)});
    // Precondition
    expect(dataModel.getGroup('id007').getTransaction('transId001')).toEqual(null);
    // Actual
    const transaction = {transactionType: 'EXPENSE', transactionId: 'transId001', name: 'Essen', creationDate: new Date(400),
      groupId: 'id007', payerId: 'memId001', payerAmount: 500, recipientIds: ['memId002'], recipientAmounts: [500], senderId: 'memId003'};
    const transaction2 = {transactionType: 'EXPENSE', transactionId: 'transId002', name: 'Essen2', creationDate: new Date(500),
      groupId: 'id007', payerId: 'memId003', payerAmount: 299, recipientIds: ['memId001', 'memId002', 'memId003'],
      recipientAmounts: [40, 199, 60], senderId: 'memId003'};
    mockedObservableService.getMultipleNewTransactionsObservable().next([transaction, transaction2]);
    const group = dataModel.getGroup('id007');
    expect(group.getTransaction('transId001')).not.toEqual(null);
    expect(group.getTransaction('transId002')).not.toEqual(null);
    expect(group.recommendations).toEqual([
      new Recommendation(group, new AtomarChange(group.getGroupmember('memId002').contact, 460),
        new AtomarChange(group.getGroupmember('memId001').contact, 460)),
      new Recommendation(group, new AtomarChange(group.getGroupmember('memId002').contact, 239),
        new AtomarChange(group.getGroupmember('memId003').contact, 239))]);
  });
});
