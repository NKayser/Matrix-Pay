import {Injectable} from '@angular/core';
import {ObservableInterface} from './observableInterface';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs'; // Subjects are multicast Observables
import {GroupsType, BalancesType, GroupMemberType, RecommendationsType, CurrencyType, UserType} from './parameterTypes';
// @ts-ignore
import {MatrixClient, MatrixEvent, EventTimeline} from 'matrix-js-sdk';
import {Utils} from "../Response/Utils";

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
  // TODO: remove magic numbers

  constructor() {
    if (Utils.log) console.log('this is ObservableService');
    this.userObservable = new Subject();
    this.groupsObservable = new Subject();
    this.balancesObservable = new Subject();
    this.recommendationsObservable = new Subject();
    this.settingsCurrencyObservable = new Subject();
  }

  public async setUp(matrixClient: MatrixClient): Promise<void> {
    this.matrixClient = matrixClient;
    // Create the User in DataModel
    const userId = this.matrixClient.getUserId();
    // test: does not give the displayName, but the userId
    const user = this.matrixClient.getUser(userId).displayName;
    // use getAccountDataFromServer instead of getAccountData in case the initial sync is not complete
    const currencyEventContent = await matrixClient.getAccountDataFromServer('currency') // content of the matrix event
      .catch(() => {if (Utils.log) console.log('rejected promise while getting account data from server'); });
    if (Utils.log) console.log(currencyEventContent);
    /* When setting language is implemented in login component:
       const languageEventContent = await matrixClient.getAccountDataFromServer('language');
       if (Utils.log) console.log(languageEventContent);*/
    this.userObservable.next({contactId: userId, name,
      currency: currencyEventContent.currency, /*language: languageEventContent.language*/ language: 'ENGLISH'});
    // start the matrix listeners
    this.listenToMatrix();
  }

  public async tearDown(): Promise<void> {
  // TODO: implement
  }

  private async listenToMatrix(): Promise<void> {
    // listen to Matrix Events, use next() on Subjects
    // TODO: add dates where necessary
    // TODO: error handling
    // TODO: detect transactions, modified transactions and when the user leaves a room
    // TODO: listen for name changes

    if (Utils.log) console.log('ObservableService is listening to Matrix');

    // Fires whenever new user-scoped account_data is added.
    this.matrixClient.on('accountData', (event, oldEvent) => {
      // if (Utils.log) console.log('got account data change' + event.getType());
      switch (event.getType()) {
        case ('currency'): {
          if (Utils.log) console.log('got currency change to ' + event.getContent().currency);
          this.settingsCurrencyObservable.next({currency: event.getContent().currency});
          break;
        }
        case ('language'): {
          if (Utils.log) console.log('got language change to ' + event.getContent().language);
          // TODO: call next() on observable
        }
      }
    });

    // Fires whenever room account data changes
    this.matrixClient.on('Room.accountData', (event, room, oldEvent) => {
      // if (Utils.log) console.log('got account data change' + event.getType());
      switch (event.getType()) {
        case ('balances'): {
          const groupId = room.roomId;
          const content = event.getContent();
          const balances = content.balances;
          const contacts = content.contacts;
          const last_transaction = content.last_transaction;
          if (Utils.log) console.log('got balances change in room ' + room.name + ' userIds: ' + contacts + ' amounts: ' + balances);
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
    // TODO: check whether it is a MatrixPay room
    this.matrixClient.on('Room', room => {
      const members = room.getLiveTimeline().getState(EventTimeline.FORWARDS).members;
      if (!(members[this.matrixClient.getUserId()].membership === 'join')) {
        return;
      }
      const groupId = room.roomId;
      const groupName = room.name;
      let userIds = [];
      let userNames = [];
      for (const id in members) {
        userIds.push(id);
        userNames.push(members[id].name);
      }
      // currency is detected a second time by the other event listener,
      // but needed here for the observable (in DataModel for the group constructor)
      const currencyEvent = room.getLiveTimeline().getState(EventTimeline.FORWARDS).getStateEvents("currency", " ");
      let currency: string;
      if (Utils.log) console.log(currencyEvent);
      // See the sdk code of getStateEvents() for explanation
      if (currencyEvent === null) {
        // no such event type or no valid events with this event type and state key
        if (Utils.log) console.log('no currency set');
      } else if (Array.isArray(currencyEvent)) {
        // extra check because currencyEvent === [] did not work
        if (currencyEvent.length === 0) {
          if (Utils.log) console.log('no currency set');
        } else {
        // event type ok, stateKey undefined (should not happen because we set stateKey to " ".)
        if (Utils.log) console.log('stateKey undefinded');
        }
      } else {
        currency = currencyEvent.getContent().currency;
        if (Utils.log) console.log(currencyEvent.getContent().currency);
      }
      if (Utils.log) console.log('new room detected. groupName: ' + groupName + ' userIds: ' + userIds + ' userNames: ' + userNames);
      // As long as we do not filter for paygroups, set currency to 'EURO' for testing
      this.groupsObservable.next({groupId, groupName, /*currency*/ currency: 'EURO', userIds,
        userNames, isLeave: false});
    });

    // Fires whenever the timeline in a room is updated
    this.matrixClient.on('Room.timeline',
      (event, room, toStartOfTimeline, removed, data) => {
      // if (Utils.log) console.log('got a timeline change. event type: '  + event.getType());
      // Maybe fetch transactions seperately
      // do we need this check?
      if (!toStartOfTimeline && data.liveEvent) {
        switch (event.getType()) {
          case ('payback'): {
            if (Utils.log) console.log('got payback. name: ' + event.getContent().name);
            break;
          }
          /*case ('m.room.message'): {
            if (Utils.log) console.log('got message. name: ' + event.event.content.body);
            break;
          }*/
        }
      } else {
        if (Utils.log) console.log('got old timeline event');
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

    // Fires whenever the event dictionary in room state is updated.
    this.matrixClient.on('RoomState.events', (event, state, prevEvent) => {
      if (event.getType() === 'currency') {
        const newCurrency = event.getContent().currency;
        if (Utils.log) console.log('got change of room currency. room: ' + state.roomId + ' new currency: ' + newCurrency);
        // TODO: call next() on observable
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
