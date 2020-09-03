import {BasicDataUpdateService} from '../Update/basic-data-update.service';
import {DataModelService} from '../DataModel/data-model.service';
import {Subject} from 'rxjs';
import {
  CurrencyType,
  GroupActivityType,
  GroupMemberType,
  GroupsType,
  LanguageType,
  TransactionType,
  UserType
} from '../ServerCommunication/CommunicationInterface/parameterTypes';
import {ObservableService} from '../ServerCommunication/CommunicationInterface/observable.service';
import {Currency} from '../DataModel/Utils/Currency';
import {Language} from "../DataModel/Utils/Language";


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

    const transactoinsObservable: Subject<TransactionType[]> = new Subject<TransactionType[]>();
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
    mockedObservableService.getUserObservable().next({contactId: 'id001', name: 'Markus', currency: 'USD', language: 'GERMAN'})
    expect(dataModel.user.contact.contactId).toEqual('id001');
    expect(dataModel.user.contact.name).toEqual('Markus');
    expect(dataModel.user.currency).toEqual(Currency.USD);
    expect(dataModel.user.language).toEqual(Language.GERMAN);
  });

  it( 'should create a group', () => {
    // Precondition
    expect(dataModel.getGroup('id002')).toEqual(null);
    // Actual
    mockedObservableService.getGroupsObservable().next({})
  });


});
