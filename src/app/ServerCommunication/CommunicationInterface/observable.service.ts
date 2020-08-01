import {Injectable} from '@angular/core';
import {ObservableInterface} from './observableInterface';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs'; // Subjects are multicast Observables
import {GroupsType, BalancesType, GroupMemberType, RecommendationsType} from './parameterTypes';

@Injectable({
  providedIn: 'root'
})
export class ObservableService implements ObservableInterface {
  private groupsObservable: Subject<GroupsType>;
  private balancesObservable: Subject<BalancesType>;
  private recommendationsObservable: Subject<RecommendationsType>;

  constructor() {
    this.groupsObservable = new Subject();
    this.balancesObservable = new Subject();
    this.recommendationsObservable = new Subject();
    this.listenToMatrix();
  }

  private listenToMatrix(): void {
    // listen to Matrix Events, use next() on Subjects
    // Bsp: this.groupsObservable.next(new GroupsType('abc', 'Unigruppe', ['a', 'b'], ['Karl', 'Sophie'], false));
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
}
