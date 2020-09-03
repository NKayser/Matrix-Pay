import {BasicDataUpdateService} from '../Update/basic-data-update.service';
import {DataModelService} from '../DataModel/data-model.service';
import {Subject} from 'rxjs';
import {CurrencyType, GroupActivityType, GroupsType, UserType} from '../ServerCommunication/CommunicationInterface/parameterTypes';
import {ObservableService} from '../ServerCommunication/CommunicationInterface/observable.service';
import {Currency} from '../DataModel/Utils/Currency';


/**
 * This Integration test class tests BasicDataUpdateService and DataModelService while mocking ObservableService
 */
describe('BasicDataUpdateService and DataModel', () => {
  let dataModel: DataModelService;
  let updateService: BasicDataUpdateService;

  const mockedObservableService = jasmine.createSpyObj('ObservableService',
    ['getUserObservable', 'getGroupsObservable', 'getSettingsCurrencyObservable', 'getUserObservable']);
  const mockedBalanceCalculatorService = jasmine.createSpyObj('BalanceCalculatorService', ['calculateBalances']);
  const mockedGreedyOptimisationService = jasmine.createSpyObj('GreedyOptimisationService', ['calculateOptimisation']);

  beforeEach(() => {
    dataModel = new DataModelService(mockedBalanceCalculatorService, mockedGreedyOptimisationService);

    const userObservable: Subject<UserType> = new Subject();
    mockedObservableService.getUserObservable.and.returnValue(userObservable);

    const groupsObservable: Subject<GroupsType> = new Subject();
    mockedObservableService.getGroupsObservable.and.returnValue(groupsObservable);

    const groupActivityObservable: Subject<GroupActivityType> = new Subject();
    mockedObservableService.getGroupActivityObservable.and.returnValue(groupActivityObservable);

    updateService = new BasicDataUpdateService(mockedObservableService, dataModel);
  });

  /*

  it('should be created', () => {
    expect(dataModel).toBeTruthy();
    expect(updateService).toBeTruthy();
  });

  it('should change currency', () => {
    const mockedCurrencyLanguageObservable: Subject<CurrencyType> = new Subject();
    mockedObservableService.getSettingsCurrencyObservable.and.returnValue(mockedCurrencyLanguageObservable);
    mockedCurrencyLanguageObservable.next({currency: 'USD'});
    expect (dataModel.user.currency).toEqual(Currency.USD);
  });

  */
});
