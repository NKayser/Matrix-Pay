import {Observable} from 'rxjs';
import {
  GroupsType,
  BalancesType,
  GroupMemberType,
  RecommendationsType,
  CurrencyType,
  UserType,
  TransactionType, LanguageType
} from './parameterTypes';

export interface ObservableInterface {
  getUserObservable(): Observable<UserType>;

  getGroupsObservable(): Observable<GroupsType>;

  getBalancesObservable(): Observable<BalancesType>;

  getRecommendationsObservable(): Observable<RecommendationsType>;

  getGroupMembershipObservable(): Observable<GroupMemberType>;

  getNewTransactionObservable(): Observable<TransactionType>;

  getMultipleNewTransactionsObservable(): Observable<TransactionType[]>

  getModifiedTransactionObservable(): Observable<TransactionType>;

  getSettingsLanguageObservable(): Observable<LanguageType>;



  getSettingsCurrencyObservable(): Observable<CurrencyType>;

  /*

  getOldTransactionsObservable(): Observable<string>;

  getOldGroupCreationActivityObservable(): Observable<string>; */

}
