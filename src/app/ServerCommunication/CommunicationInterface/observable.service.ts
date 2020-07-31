import {Injectable} from '@angular/core';
import {ObservableInterface} from './observableInterface';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservableService implements ObservableInterface {

  constructor() {
  }

  // inside the Observable construction, listen to matrix events and pass the data via the string parameter of subscriber.next()
  getGroupsObservable(): Observable<string> {
    return new Observable(subscriber => subscriber.next('someString'));
  }

  getBalancesObservable(): Observable<string> {
    return new Observable(subscriber => subscriber.next('someString'));
  }

  getRecommendationsObservable(): Observable<string> {
    return new Observable(subscriber => subscriber.next('someString'));
  }

  getGroupMembershipObservable(): Observable<string> {
    return new Observable(subscriber => subscriber.next('someString'));
  }

  getNewTransactionObservable(): Observable<string> {
    return new Observable(subscriber => subscriber.next('someString'));
  }

  getModifiedTransactionObservable(): Observable<string> {
    return new Observable(subscriber => subscriber.next('someString'));
  }

  getSettingsLanguageObservable(): Observable<string> {
    return new Observable(subscriber => subscriber.next('someString'));
  }

  getSettingsCurrencyObservable(): Observable<string> {
    return new Observable(subscriber => subscriber.next('someString'));
  }

  getOldTransactionsObservable(): Observable<string> {
    return new Observable(subscriber => subscriber.next('someString'));
  }

  getOldGroupCreationActivityObservable(): Observable<string> {
    return new Observable(subscriber => subscriber.next('someString'));
  }
}
