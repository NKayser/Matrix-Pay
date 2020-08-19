import {Observable} from 'rxjs';
import {
  GroupsType,
  BalancesType,
  GroupMemberType,
  RecommendationsType,
  CurrencyType,
  UserType,
  TransactionType, LanguageType, GroupActivityType
} from './parameterTypes';

export interface ObservableInterface {
  getUserObservable(): Observable<UserType>;

  getGroupsObservable(): Observable<GroupsType>;

  getBalancesObservable(): Observable<BalancesType>;

  getRecommendationsObservable(): Observable<RecommendationsType>;

  getGroupMembershipObservable(): Observable<GroupMemberType>;

  getNewTransactionObservable(): Observable<TransactionType>;

  getMultipleNewTransactionsObservable(): Observable<TransactionType[]>;

  getModifiedTransactionObservable(): Observable<TransactionType>;

  getSettingsLanguageObservable(): Observable<LanguageType>;

  getGroupActivityObservable(): Observable<GroupActivityType>;

  getSettingsCurrencyObservable(): Observable<CurrencyType>;

  /*

  getOldTransactionsObservable(): Observable<string>;

  getOldGroupCreationActivityObservable(): Observable<string>; */

}
