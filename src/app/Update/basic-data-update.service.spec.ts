import {BasicDataUpdateService} from './basic-data-update.service';
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
import {Currency} from '../DataModel/Utils/Currency';
import {Language} from '../DataModel/Utils/Language';
import {ActivityType} from '../DataModel/Group/ActivityType';
import {AtomarChange} from '../DataModel/Group/AtomarChange';
import {Contact} from '../DataModel/Group/Contact';
import {Groupmember} from '../DataModel/Group/Groupmember';
import {TransactionType} from '../DataModel/Group/TransactionType';


/**
 * This Integration test class tests BasicDataUpdateService and DataModelService while mocking ObservableService
 */
describe('BasicDataUpdateService and DataModel', () => {
  let dataModel: DataModelService;
  let updateService: BasicDataUpdateService;

  const mockedObservableService = jasmine.createSpyObj('ObservableService',
    ['getUserObservable', 'getGroupsObservable', 'getGroupActivityObservable', 'getSettingsLanguageObservable',
      'getSettingsCurrencyObservable', 'getGroupMembershipObservable', 'getMultipleNewTransactionsObservable']);
  const mockedBalanceCalculatorService = jasmine.createSpyObj('BalanceCalculatorService', ['calculateBalances']);
  const mockedGreedyOptimisationService = jasmine.createSpyObj('GreedyOptimisationService', ['calculateOptimisation']);

  beforeEach(() => {
    dataModel = new DataModelService(mockedBalanceCalculatorService, mockedGreedyOptimisationService);

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

    const transactoinsObservable: Subject<TransactionTypeInterface[]> = new Subject<TransactionTypeInterface[]>();
    mockedObservableService.getMultipleNewTransactionsObservable.and.returnValue(transactoinsObservable);

    updateService = new BasicDataUpdateService(mockedObservableService, dataModel);
  });

  it('should be created', () => {
    expect(dataModel).toBeTruthy();
    expect(updateService).toBeTruthy();
  });

  it('should change currency', () => {
    // Precondition
    expect(dataModel.user.currency).toEqual(Currency.EUR);
    // Actual
    mockedObservableService.getSettingsCurrencyObservable().next({currency: 'USD'});
    expect(dataModel.user.currency).toEqual(Currency.USD);
  });

  it('should change language', () => {
    // Precondition
    expect(dataModel.user.language).toEqual(Language.ENGLISH);
    // Actual
    mockedObservableService.getSettingsLanguageObservable().next({language: 'GERMAN'});
    expect(dataModel.user.language).toEqual(Language.GERMAN);
  });

  it('should fill in user data', () => {
    // Precondition
    expect(dataModel.user.contact.contactId).toEqual('');
    expect(dataModel.user.contact.name).toEqual('');
    expect(dataModel.user.currency).toEqual(Currency.EUR);
    expect(dataModel.user.language).toEqual(Language.ENGLISH);
    // Actual
    mockedObservableService.getUserObservable().next({contactId: 'id001', name: 'Markus', currency: 'USD', language: 'GERMAN'});
    expect(dataModel.user.contact.contactId).toEqual('id001');
    expect(dataModel.user.contact.name).toEqual('Markus');
    expect(dataModel.user.currency).toEqual(Currency.USD);
    expect(dataModel.user.language).toEqual(Language.GERMAN);
  });

  it( 'should create a group', () => {
    // Precondition
    expect(dataModel.getGroup('id003')).toEqual(null);
    // Actual
    mockedObservableService.getGroupsObservable().next({groupId: 'id003', groupName: 'Urlaub', currency: 'USD', userIds: [],
      userNames: [], isLeave: false});
    expect(dataModel.getGroup('id003')).not.toEqual(null);
    expect(dataModel.getGroup('id003').name).toEqual('Urlaub');
    expect(dataModel.getGroup('id003').currency).toEqual(Currency.USD);
    expect(dataModel.getGroup('id003').transactions).toEqual([]);
    expect(dataModel.getGroup('id003').groupmembers).toEqual([]);
  });

  it( 'should create a group activity', () => {
    // Precondition
    expect(dataModel.getGroup('id003')).toEqual(null);
    // Actual
    mockedObservableService.getGroupActivityObservable().next({groupId: 'id000', creatorId: 'memId000', creationDate: new Date(12345)});
    expect(dataModel.getGroup('id000').activities[0].actor).toEqual(dataModel.getGroup('id000').getGroupmember('memId000').contact);
    expect(dataModel.getGroup('id000').activities[0].creationDate).toEqual(new Date(12345));
    expect(dataModel.getGroup('id000').activities[0].activityType).toEqual(ActivityType.GROUPCREATION);
    expect(dataModel.getGroup('id000').activities[0].subject).toEqual(dataModel.getGroup('id000'));
  });

  it( 'should delete a group', () => {
    expect(dataModel.getGroup('id004')).toEqual(null);
    mockedObservableService.getGroupsObservable().next({groupId: 'id004', groupName: 'Urlaub', currency: 'USD', userIds: [],
      userNames: [], isLeave: false});
    expect(dataModel.getGroup('id004')).not.toEqual(null);
    mockedObservableService.getGroupsObservable().next({groupId: 'id004', groupName: 'Urlaub', currency: 'USD', userIds: [],
      userNames: [], isLeave: true});
    expect(dataModel.getGroup('id004')).toEqual(null);
  });

  it( 'should create a groupmember and related activity', () => {
    mockedObservableService.getGroupsObservable().next({groupId: 'id005', groupName: 'Urlaub', currency: 'USD', userIds: [],
      userNames: [], isLeave: false});
    // Precondition
    expect(dataModel.getGroup('id005').getGroupmember('memId001')).toEqual(null);
    // Actual
    mockedObservableService.getGroupMembershipObservable().next({groupId: 'id005', userId: 'memId001', name: 'Markus',
      isLeave: false, date: new Date(123456789000)});
    expect(dataModel.getGroup('id005').getGroupmember('memId001')).not.toEqual(null);
    expect(dataModel.getGroup('id005').getGroupmember('memId001').group).toEqual(dataModel.getGroup('id005'));
    expect(dataModel.getGroup('id005').getGroupmember('memId001').contact.contactId).toEqual('memId001');
    expect(dataModel.getGroup('id005').getGroupmember('memId001').contact.name).toEqual('Markus');
    expect(dataModel.getGroup('id005').activities[0].actor).toEqual
    (dataModel.getGroup('id005').getGroupmember('memId001').contact);
    expect(dataModel.getGroup('id005').activities[0].subject).toEqual(dataModel.getGroup('id005'));
    expect(dataModel.getGroup('id005').activities[0].activityType).toEqual(ActivityType.NEWCONTACTINGROUP);
    expect(dataModel.getGroup('id005').activities[0].creationDate).toEqual(new Date(123456789000));
  });

  it( 'should delete a groupmember', () => {
    mockedObservableService.getGroupMembershipObservable().next({groupId: 'id005', userId: 'memId001', name: 'Markus',
      isLeave: false, date: new Date(123456789000)});
    // Precondition
    expect(dataModel.getGroup('id005').getGroupmember('memId001')).not.toEqual(null);
    expect(dataModel.getGroup('id005').getGroupmember('memId001').active).toEqual(true);

    // Actual
    mockedObservableService.getGroupMembershipObservable().next({groupId: 'id005', userId: 'memId001', name: 'Markus',
      isLeave: true, date: new Date(123456789000)});
    expect(dataModel.getGroup('id005').getGroupmember('memId001')).not.toEqual(null);
    expect(dataModel.getGroup('id005').getGroupmember('memId001').active).toEqual(false);
  });

  it( 'should create an empty group for a groupmember', () => {
    expect(dataModel.getGroup('id006')).toEqual(null);
    mockedObservableService.getGroupMembershipObservable().next({groupId: 'id006', userId: 'memId001', name: 'Markus',
      isLeave: false, date: new Date(123456789000)});
    expect(dataModel.getGroup('id006').getGroupmember('memId001')).not.toEqual(null);
  });

  it( 'should fill in a group', () => {
    // Setup
    expect(dataModel.getGroup('id006')).toEqual(null);
    mockedObservableService.getGroupMembershipObservable().next({groupId: 'id006', userId: 'memId001', name: 'Markus',
      isLeave: false, date: new Date(123456789000)});
    // Precondition
    expect(dataModel.getGroup('id006').getGroupmember('memId001')).not.toEqual(null);
    expect(dataModel.getGroup('id006').name).toEqual('');
    expect(dataModel.getGroup('id006').currency).toEqual(Currency.EUR);
    // Actual
    mockedObservableService.getGroupsObservable().next({groupId: 'id006', groupName: 'Urlaub', currency: 'USD', userIds: [],
      userNames: [], isLeave: false});
    expect(dataModel.getGroup('id006').name).toEqual('Urlaub');
    expect(dataModel.getGroup('id006').currency).toEqual(Currency.USD);
  });

  it( 'should create a transaction and related activity', () => {
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
    mockedObservableService.getMultipleNewTransactionsObservable().next([transaction]);
    expect(dataModel.getGroup('id007').getTransaction('transId001')).not.toEqual(null);
    expect(dataModel.getGroup('id007').getTransaction('transId001').name).toEqual('Essen');
    expect(dataModel.getGroup('id007').getTransaction('transId001').payer).
    toEqual(new AtomarChange(new Contact('memId001', 'Markus'), 500));
    expect(dataModel.getGroup('id007').getTransaction('transId001').recipients).
    toEqual([new AtomarChange(new Contact('memId002', 'Marion'), 500)]);
    expect(dataModel.getGroup('id007').getTransaction('transId001').sender).
    toEqual(new Groupmember(new Contact('memId003', 'Nico'), dataModel.getGroup('id007')));
    expect(dataModel.getGroup('id007').getTransaction('transId001').transactionType).toEqual(TransactionType.EXPENSE);
    const activities = dataModel.getGroup('id007').activities;
    expect(activities[activities.length - 1].subject).toEqual(dataModel.getGroup('id007').getTransaction('transId001'));
    expect(activities[activities.length - 1].actor).toEqual(dataModel.getGroup('id007').getGroupmember('memId003').contact);
    expect(activities[activities.length - 1].activityType).toEqual(ActivityType.NEWEXPENSE);
    expect(activities[activities.length - 1].creationDate).toEqual(new Date(400));
    expect(mockedBalanceCalculatorService.calculateBalances).toHaveBeenCalled();
  });

  it( 'should create empty group and empty groupmembers for transaction', () => {
    // Precondition
    expect(dataModel.getGroup('id008')).toEqual(null);
    // Actual
    const transaction = {transactionType: 'EXPENSE', transactionId: 'transId001', name: 'Essen', creationDate: new Date(555),
      groupId: 'id008', payerId: 'memId001', payerAmount: 500, recipientIds: ['memId002'], recipientAmounts: [500], senderId: 'memId003'};
    mockedObservableService.getMultipleNewTransactionsObservable().next([transaction]);
    expect(dataModel.getGroup('id008')).not.toEqual(null);
    expect(dataModel.getGroup('id008').getGroupmember('memId001')).not.toEqual(null);
    expect(dataModel.getGroup('id008').getGroupmember('memId002')).not.toEqual(null);
    expect(dataModel.getGroup('id008').getGroupmember('memId003')).not.toEqual(null);
  });

  it( 'should fill in a groupmember and create a relted activity', () => {
    // Setup
    const transaction = {transactionType: 'EXPENSE', transactionId: 'transId001', name: 'Essen', creationDate: new Date(555),
      groupId: 'id009', payerId: 'memId001', payerAmount: 500, recipientIds: ['memId002'], recipientAmounts: [500], senderId: 'memId003'};
    mockedObservableService.getMultipleNewTransactionsObservable().next([transaction]);
    // Precondition
    expect(dataModel.getGroup('id009').getGroupmember('memId001')).not.toEqual(null);
    expect(dataModel.getGroup('id009').getGroupmember('memId001').contact.name).toEqual('');
    expect(dataModel.getGroup('id009').activities.length).toEqual(1);
    // Actual
    mockedObservableService.getGroupMembershipObservable().next({groupId: 'id009', userId: 'memId001', name: 'Markus',
      isLeave: false, date: new Date(123456789000)});
    expect(dataModel.getGroup('id009').getGroupmember('memId001').contact.name).toEqual('Markus');
    expect(dataModel.getGroup('id009').getGroupmember('memId001').group).toEqual(dataModel.getGroup('id009'));
    expect(dataModel.getGroup('id009').activities.length).toEqual(2);
    expect(dataModel.getGroup('id009').activities[1].actor).toEqual
    (dataModel.getGroup('id009').getGroupmember('memId001').contact);
    expect(dataModel.getGroup('id009').activities[1].subject).toEqual(dataModel.getGroup('id009'));
    expect(dataModel.getGroup('id009').activities[1].activityType).toEqual(ActivityType.NEWCONTACTINGROUP);
    expect(dataModel.getGroup('id009').activities[1].creationDate).toEqual(new Date(123456789000));
  });

});
