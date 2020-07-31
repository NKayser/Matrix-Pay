import {Observable} from 'rxjs';

export interface ObservableInterface {
  getGroupsObservable(): Observable<string>;

  getBalancesObservable(): Observable<string>;

  getRecommendationsObservable(): Observable<string>;

  getGroupMembershipObservable(): Observable<string>;

  getNewTransactionObservable(): Observable<string>;

  getModifiedTransactionObservable(): Observable<string>;

  getSettingsLanguageObservable(): Observable<string>;

  getSettingsCurrencyObservable(): Observable<string>;

  getOldTransactionsObservable(): Observable<string>;

  getOldGroupCreationActivityObservable(): Observable<string>;

}
