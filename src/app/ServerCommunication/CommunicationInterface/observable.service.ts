import {Injectable} from '@angular/core';
import {ObservableInterface} from './observableInterface';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs'; // Subjects are multicast Observables
import {GroupsType, BalancesType, GroupMemberType, RecommendationsType, CurrencyType, UserType} from './parameterTypes';
// @ts-ignore
import {MatrixClient, MatrixEvent, EventTimeline} from 'matrix-js-sdk';

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
De  // TODO: remove magic numbers

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
    this.userObservable.next({contactId: userId, name: 'Name',
      currency: currencyObject.currency, /*language: language*/ language: 'ENGLISH'});
    this.listenToMatrix();
  }

  public async tearDown(): Promise<void> {
  }

  private listenToMatrix(): void {
    // listen to Matrix Events, use next() on Subjects
    // TODO: add dates where necessary
    // TODO: listen for name changes
    // TODO: detect rooms the user left

    console.log('ObservableService is listening to Matrix');

    // Fires whenever account data changes
    this.matrixClient.on('accountData', (event, oldEvent) => {
      // console.log('got account data change' + event.getType());
      switch (event.getType()) {
        case ('currency'): {
          console.log('got currency change to ' + event.getContent().currency);
          this.settingsCurrencyObservable.next({currency: event.getContent().currency});
          break;
        }
        case ('language'): {
          console.log('got language change to ' + event.getContent().language);
          // TODO: call next() on observable
        }
      }
    });

    // Fires whenever room account data changes
    this.matrixClient.on('Room.accountData', (event, room, oldEvent) => {
      // console.log('got account data change' + event.getType());
      switch (event.getType()) {
        case ('balances'): {
          const groupId = room.roomId;
          const content = event.getContent();
          const balances = content.balances;
          const contacts = content.contacts;
          const last_transaction = content.last_transaction;
          console.log('got balances change in room ' + room.name + ' userIds: ' + contacts + ' amounts: ' + balances);
          // TODO: call next() on observable
          break;
        }
        case ('recommendation'): {
          const groupId = room.roomId;
          const content = event.getContent();
          const recipients = content.recipients;
          const payers = content.payers;
          const amount = content.amounts;
          const last_transaction = content.last_transaction;
          // TODO: call next() on observable
          break;
        }
      }
    });

    // Fires whenever invited to a room or joining a room
    // TODO: check whether client joined, check whether it is a MatrixPay room
    this.matrixClient.on('Room', room => {
      console.log('new room detected');
      const groupId = room.roomId;
      const groupName = room.name;
      // currency is detected a second time by the other event listener, but needed here for the constructor
      const currency = room.getLiveTimeline().getState(EventTimeline.FORWARDS).currency;
      console.log(currency);
      // TODO: get missing attributes from matrix
      this.groupsObservable.next({groupId, groupName, currency: 'EURO', userIds: ['a', 'b'],
        userNames: ['Karl', 'Sophie'], isLeave: false});
    });

    // Fires whenever the timeline in a room is updated
    this.matrixClient.on('Room.timeline',
      (event, room, toStartOfTimeline, removed, data) => {
      console.log('got a timeline change. event type: '  + event.getType());
      // Maybe fetch transactions seperately
      // do we need this check?
      if (!toStartOfTimeline && data.liveEvent) {
        switch (event.getType()) {
          case ('payback'): {
            console.log('got payback. name: ' + event.getContent().name);
            break;
          }
          /*case ('m.room.message'): {
            console.log('got message. name: ' + event.event.content.body);
            break;
          }*/
        }
      } else {
        console.log('got old timeline event');
      }
    });

    // Fires whenever any room member's membership state changes.
    this.matrixClient.on('RoomMember.membership', (event, member, oldMembership) => {
      const userId = member.userId;
      const groupId = member.roomId;
      let isLeave: boolean;
      if ((oldMembership === 'invite' || oldMembership === 'leave') && member.membership === 'join') {
        isLeave = false;
      } else if (oldMembership === 'join' && member.membership === 'leave') {
        isLeave = true;
      }
      // TODO: call next() on observable
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
