import {Observable} from 'rxjs';
import {GroupsType, BalancesType, GroupMemberType, RecommendationsType, CurrencyType} from './parameterTypes';

export interface ObservableInterface {
  getGroupsObservable(): Observable<GroupsType>;

  getBalancesObservable(): Observable<BalancesType>;

  getRecommendationsObservable(): Observable<RecommendationsType>;

 /* getGroupMembershipObservable(): Observable<string>;

  getNewTransactionObservable(): Observable<string>;

  getModifiedTransactionObservable(): Observable<string>;

  getSettingsLanguageObservable(): Observable<string>;

  */

  getSettingsCurrencyObservable(): Observable<CurrencyType>;

  /*

  getOldTransactionsObservable(): Observable<string>;

  getOldGroupCreationActivityObservable(): Observable<string>; */

}
