import {Injectable} from '@angular/core';
import {ObservableInterface} from './observableInterface';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs'; // Subjects are multicast Observables
import {GroupsType, BalancesType, GroupMemberType, RecommendationsType, CurrencyType} from './parameterTypes';
import {MatrixClientService} from './matrix-client.service';
// @ts-ignore
import {MatrixClient} from 'matrix-js-sdk';

@Injectable({
  providedIn: 'root'
})
export class ObservableService implements ObservableInterface {
  private matrixClient: MatrixClient; // move into local scope of listenToMatrix()?
  private matrixClientService: MatrixClientService;
  private groupsObservable: Subject<GroupsType>;
  private balancesObservable: Subject<BalancesType>;
  private recommendationsObservable: Subject<RecommendationsType>;
  private settingsCurrencyObservable: Subject<CurrencyType>;

  constructor(matrixClientService: MatrixClientService) {
    console.log('this is ObservableService');
    this.matrixClientService = matrixClientService;
    this.groupsObservable = new Subject();
    this.balancesObservable = new Subject();
    this.recommendationsObservable = new Subject();
    this.listenToMatrix();
  }

  private async listenToMatrix(): Promise<void> {
    this.matrixClientService.getClientObserver().subscribe(
      client => {
        console.log('listening to Matrix');
        // these two lines are temporary (test)
        let domain = client.getDomain();
        console.log(domain);
        client.on("Room.timeline", function(event, room, toStartOfTimeline) {
          // we know we only want to respond to messages
          if (event.getType() !== 'currency') {
            console.log('currency changed');
            return;
          }
        });
      }
    );
    // this.matrixClient = await this.matrixClientService.getClient();
    // listen to Matrix Events, use next() on Subjects
    // example: this.groupsObservable.next({groupId: 'abc', groupName: 'Unigruppe', userIds: ['a', 'b'], userNames: ['Karl', 'Sophie'], isLeave: false});
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
