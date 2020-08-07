import {Injectable} from '@angular/core';
import {ObservableInterface} from './observableInterface';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs'; // Subjects are multicast Observables
import {GroupsType, BalancesType, GroupMemberType, RecommendationsType, CurrencyType} from './parameterTypes';
// @ts-ignore
import {MatrixClient} from 'matrix-js-sdk';

@Injectable({
  providedIn: 'root'
})
export class ObservableService implements ObservableInterface {
  private matrixClient: MatrixClient;
  private groupsObservable: Subject<GroupsType>;
  private balancesObservable: Subject<BalancesType>;
  private recommendationsObservable: Subject<RecommendationsType>;
  private settingsCurrencyObservable: Subject<CurrencyType>;

  constructor() {
    console.log('this is ObservableService');
    this.groupsObservable = new Subject();
    this.balancesObservable = new Subject();
    this.recommendationsObservable = new Subject();
    this.settingsCurrencyObservable = new Subject();
  }

  public async setUp(matrixClient: MatrixClient): void {
    this.matrixClient = matrixClient;
    this.listenToMatrix();
  }

  public async tearDown(): void {
  }

  private listenToMatrix(): void {
    // listen to Matrix Events, use next() on Subjects
    // tslint:disable-next-line:max-line-length
    // example: this.groupsObservable.next({groupId: 'abc', groupName: 'Unigruppe', userIds: ['a', 'b'], userNames: ['Karl', 'Sophie'], isLeave: false});
    console.log('ObservableService is listening to Matrix');
    // these two lines are temporary (test)
    let domain = this.matrixClient.getDomain();
    console.log(domain);
    this.matrixClient.on('accountData', function(event, oldEvent){
      // console.log('got account data change');
      if (event.getType() === 'currency') {
        // console.log('got currency change');
        // TODO: call next() on settingsCurrencyObservable
      }
    });
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
