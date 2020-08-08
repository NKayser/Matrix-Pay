import {Injectable} from '@angular/core';
import {ObservableInterface} from './observableInterface';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs'; // Subjects are multicast Observables
import {GroupsType, BalancesType, GroupMemberType, RecommendationsType, CurrencyType, UserType} from './parameterTypes';
// @ts-ignore
import {MatrixClient, MatrixEvent} from 'matrix-js-sdk';

@Injectable({
  providedIn: 'root'
})
export class ObservableService implements ObservableInterface {
  private matrixClient: MatrixClient;
  private userObservable: Subject<UserType>;
  private groupsObservable: Subject<GroupsType>;
  private balancesObservable: Subject<BalancesType>;
  private recommendationsObservable: Subject<RecommendationsType>;
  private settingsCurrencyObservable: Subject<CurrencyType>;

  constructor() {
    console.log('this is ObservableService');
    this.userObservable = new Subject();
    this.groupsObservable = new Subject();
    this.balancesObservable = new Subject();
    this.recommendationsObservable = new Subject();
    this.settingsCurrencyObservable = new Subject();
  }

  public async setUp(matrixClient: MatrixClient): Promise<void> {
    this.matrixClient = matrixClient;
    // TODO: get name from Matrix
    const userId = await this.matrixClient.getUserId();
    const currencyObject = await matrixClient.getAccountDataFromServer('currency');
    console.log(currencyObject);
    // When setting language is implemented in login component:
    // const language = await matrixClient.getAccountDataFromServer('language');
    // console.log(language);
    this.userObservable.next({contactId: userId, name: 'Name', currency: currencyObject['currency'], /*language: language*/ language: 'ENGLISH'});
    this.listenToMatrix();
  }

  public async tearDown(): Promise<void> {
  }

  private listenToMatrix(): void {
    // listen to Matrix Events, use next() on Subjects
    // tslint:disable-next-line:max-line-length
    // example: this.groupsObservable.next({groupId: 'abc', groupName: 'Unigruppe', userIds: ['a', 'b'], userNames: ['Karl', 'Sophie'], isLeave: false});
    console.log('ObservableService is listening to Matrix');
    // these two lines are temporary (test)
    let domain = this.matrixClient.getDomain();
    console.log(domain);
    this.matrixClient.on('accountData', (event, oldEvent) => {
      // console.log('got account data change' + event.getType());
      if (event.getType() === 'currency') {
        console.log('got currency change to ' + event.getContent().currency);
        this.settingsCurrencyObservable.next({currency: event.getContent().currency});
      }
    });
  }

  getUserObservable(): Observable<UserType> {
    return this.userObservable;
  }

  getGroupsObservable(): Observable<GroupsType> {
    return this.groupsObservable;
  }

  getBalancesObservable(): Observable<BalancesType> {
    return this.balancesObservable;
  }

  getRecommendationsObservable(): Observable<RecommendationsType> {
    return this.recommendationsObservable;
  }

  getSettingsCurrencyObservable(): Observable<CurrencyType> {
    return this.settingsCurrencyObservable;
  }
}
