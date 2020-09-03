import {Injectable} from '@angular/core';
import {ObservableInterface} from './observableInterface';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs'; // Subjects are multicast Observables
import {
  GroupsType,
  BalancesType,
  GroupMemberType,
  RecommendationsType,
  CurrencyType,
  UserType,
  TransactionType,
  LanguageType,
  GroupActivityType
} from './parameterTypes';
// @ts-ignore
import {MatrixClient, MatrixEvent, EventTimeline, EventTimelineSet, TimelineWindow, Room, Filter, FilterComponent} from 'matrix-js-sdk';
import {Utils} from '../Response/Utils';
import {MatrixClientService} from './matrix-client.service';
import {ClientInterface} from './ClientInterface';

@Injectable({
  providedIn: 'root'
})
export class ObservableService implements ObservableInterface {
  private static TRANSACTION_TYPE_PAYBACK = 'PAYBACK';
  private static TRANSACTION_TYPE_EXPENSE = 'EXPENSE';

  private matrixClient: MatrixClient;

  private clientService: MatrixClientService;
  private userObservable: Subject<UserType>;
  private groupsObservable: Subject<GroupsType>;
  private balancesObservable: Subject<BalancesType>;
  private recommendationsObservable: Subject<RecommendationsType>;
  private settingsCurrencyObservable: Subject<CurrencyType>;
  private settingsLanguageObservable: Subject<LanguageType>;
  private groupMembershipObservable: Subject<GroupMemberType>;
  private modifiedTransactionsObservable: Subject<TransactionType>;
  private multipleNewTransactionsObservable: Subject<TransactionType[]>;
  private newTransactionObservable: Subject<TransactionType>;
  private groupActivityObservable: Subject<GroupActivityType>;

  private transactions = {};


  constructor(clientService: MatrixClientService) {
    this.clientService = clientService;

    this.userObservable = new Subject();
    this.groupsObservable = new Subject();
    this.balancesObservable = new Subject();
    this.recommendationsObservable = new Subject();
    this.settingsCurrencyObservable = new Subject();
    this.groupMembershipObservable = new Subject();
    this.newTransactionObservable = new Subject();
    this.modifiedTransactionsObservable = new Subject();
    this.multipleNewTransactionsObservable = new Subject();
    this.settingsLanguageObservable = new Subject();
    this.groupActivityObservable = new Subject();

    this.clientService.getLoggedInEmitter().subscribe(async () => {
      await this.setUp();
    });
  }

  private async setUp(): Promise<void> {
    // get the client (logged in, but before /sync)
    this.matrixClient = this.clientService.getClient();

    // start the matrix listeners
    this.accountDataListener();
    this.roomAccountDataListener();
    this.timelineListener();
    this.roomListener();
    this.membershipListener();
    this.timelineResetListener();

    const filter = Filter.fromJson(this.matrixClient.credentials.userId, 'edu.kit.tm.dsn.psess2020.matrixpay-v1', {
      "room": {
        "state": {
          "types": ["m.room.*", "org.matrix.msc1840"],
        },
        "timeline": {
          "limit": 10,
          "types": ["com.matrixpay.currency", 'com.matrixpay.language', 'com.matrixpay.payback', 'com.matrixpay.expense', 'm.room.create', 'm.room.member'],
        },
        "ephemeral": {
          "not_types": ["*"],
        }
      },
      "presence": {
        "not_types": ["*"],
      },
    });

    if (Utils.log) console.log(filter);

    await this.matrixClient.startClient({includeArchivedRooms: false, filter});

    // Get data about the user
    const userId = this.matrixClient.getUserId();
    const currencyEventContent = await this.matrixClient.getAccountDataFromServer('com.matrixpay.currency'); // content of the matrix event
    const languageEventContent = await this.matrixClient.getAccountDataFromServer('com.matrixpay.language');
    if (currencyEventContent !== null) {
      this.userObservable.next({contactId: userId, name: this.matrixClient.getUser(userId).displayName,
        currency: currencyEventContent.currency, language: languageEventContent.language});
    }
  }

  private async processNewRoom(room: Room): Promise<void> {
    const groupId = room.roomId;
    const groupName = room.name;
    const userIds = [];
    const userNames = [];

    const currencyEvent = room.getLiveTimeline().getState(EventTimeline.FORWARDS).getStateEvents('com.matrixpay.currency', ' ');
    let currency: string;
    if (currencyEvent === null) {
      // no such event type or no valid events with this event type and state key
      console.log('no currency set');
    } else {
      currency = currencyEvent.getContent().currency;
      if (Utils.log) console.log(currencyEvent.getContent().currency);
    }

    if (Utils.log) console.log('new room detected. groupName: ' + groupName + ' userIds: ' + userIds + ' userNames: ' + userNames + ' currency: ' + currency);
    this.groupsObservable.next({
      groupId, groupName, currency, userIds,
      userNames, isLeave: false
    });

    // The things written into the local store of the client will eventually be detected by the listeners.
    if (Utils.log) console.log('---window---');
    const timelineWindow = new TimelineWindow(this.matrixClient, room.getLiveTimeline().getTimelineSet());
    timelineWindow.load();
    if (Utils.log) console.log(timelineWindow.getEvents());
    if (Utils.log) console.log('canPaginate in room ' + room.name + ': ' + timelineWindow.canPaginate(EventTimeline.BACKWARDS));
    await this.paginateBackwardsUntilTheEnd(timelineWindow);
    if (Utils.log) console.log('found old transactions in room ' + room.roomId + ': ' + this.transactions.hasOwnProperty(room.roomId));
    if (this.transactions.hasOwnProperty(room.roomId)) {
      this.multipleNewTransactionsObservable.next(this.transactions[room.roomId]);
      if (Utils.log) console.log('Anzahl Transaktionen: ' + this.transactions[room.roomId].length);
    }
  }

  private async paginateBackwardsUntilTheEnd(window: TimelineWindow): Promise<void> {
    const gotMoreEvents: boolean = await window.paginate(EventTimeline.BACKWARDS, 10);
    if (gotMoreEvents) {
      await this.paginateBackwardsUntilTheEnd(window);
    } else {
      return;
    }
  }

  // listeners

  private accountDataListener(): void {
    // Fires whenever new user-scoped account_data is added.
    this.matrixClient.on('accountData', (event, oldEvent) => {
      // if (Utils.log) console.log('got account data change' + event.getType());
      switch (event.getType()) {
        case ('com.matrixpay.currency'): {
          if (Utils.log) { console.log('got currency change to ' + event.getContent().currency); }
          this.settingsCurrencyObservable.next({currency: event.getContent().currency});
          break;
        }
        case ('com.matrixpay.language'): {
          if (Utils.log) { console.log('got language change to ' + event.getContent().language); }
          this.settingsLanguageObservable.next({language: event.getContent().language});
          break;
        }
      }
    });
  }

  // not necessary in current version
  private roomAccountDataListener(): void {
    // Fires whenever room account data changes
    this.matrixClient.on('Room.accountData', (event, room, oldEvent) => {
      // if (Utils.log) console.log('got account data change' + event.getType());
      switch (event.getType()) {
        case ('com.matrixpay.balances'): {
          const groupId = room.roomId;
          const content = event.getContent();
          const balances = content.balances;
          const contacts = content.contacts;
          const last_transaction = content.last_transaction;
          if (Utils.log) { console.log('got balances change in room ' + room.name + ' userIds: ' + contacts + ' amounts: ' + balances); }
          // call next() on observable
          break;
        }
        case ('com.matrixpay.recommendation'): {
          const groupId = room.roomId;
          const content = event.getContent();
          const recipients = content.recipients;
          const payers = content.payers;
          const amount = content.amounts;
          const last_transaction = content.last_transaction;
          // call next() on observable
          break;
        }
      }
    });
  }

  private timelineListener(): void {
    // Fires whenever the timeline in a room is updated
    this.matrixClient.on('Room.timeline',
      (event, room, toStartOfTimeline, removed, data) => {
        // if (Utils.log) console.log('got a timeline change. event type: '  + event.getType());
        if (!data.liveEvent) {
          // Process the events retrieved by backpagination
          switch (event.getType()) {
            case ('com.matrixpay.payback'): {
              console.log('got an old payback. name: ' + event.getContent().name + ' room: ' + room.name);
              if (!this.transactions.hasOwnProperty(room.roomId)) { this.transactions[room.roomId] = []; }
              this.transactions[room.roomId].push(this.getPaybackFromEvent(room, event));
              break;
            }
            case ('com.matrixpay.expense'): {
              if(!event.isRelation()) {
                // If the event has been replaced, getContent() returns the content of the replacing event.
                if (Utils.log) console.log('got an old expense. name: ' + event.getContent().name);
                if (!this.transactions.hasOwnProperty(room.roomId)) { this.transactions[room.roomId] = []; }
                this.transactions[room.roomId].push(this.getExpenseFromEvent(room, event));
              } else if (event.isRelation('m.replace')) {
                if (Utils.log) console.log('got an old editing of an expense. name: ' + event.getContent().name);
                // this.oldModifiedTransactions[room.roomId].push(transaction);
                this.modifiedTransactionsObservable.next(this.getExpenseFromEvent(room, event));
              }
              break;
            }
            case ('m.room.create'): {
              if (Utils.log) console.log('got an old room creation. room: ' + room.name + ' creator: ' + event.getContent().creator + ' date: ' + event.getDate());
              this.groupActivityObservable.next(
                {groupId: room.roomId, creatorId: event.getContent().creator, creationDate: event.getDate()}
                );
              break;
            }
            case ('m.room.member'): {
              // use getPrevContent() if necessary
              let isLeave: boolean;
              if (event.getContent().membership === 'join') {
                if (Utils.log) console.log('got an old room membership change: ' + event.getStateKey() + ' joined the room ' + room.name);
                isLeave = false;
              }
              if (event.getContent().membership === 'leave') {
                if (Utils.log) console.log('got an old room membership change: ' + event.getStateKey() + ' left the room ' + room.name);
                isLeave = true;
              }
              this.groupMembershipObservable.next(
                {groupId: room.roomId, userId: event.getStateKey(), date: event.getDate(), isLeave, name: room.getMember(event.getStateKey()).user.displayName}
                );
              break;
            }
          }
        }
        if (data.liveEvent) {
          // Process the events retrieved by /sync
          switch (event.getType()) {
            case ('com.matrixpay.payback'): {
              this.multipleNewTransactionsObservable.next([this.getPaybackFromEvent(room, event)]);
              break;
            }
            case ('com.matrixpay.expense'): {
              if (!event.isRelation()) {
                // We could consider using getOriginalContent() instead of getContent(), because if this event has been replaced
                // (replacing event in the same /sync batch),
                // getContent() returns the content of the replacing event (?), but the information about the replacement
                // will be received through the replacing event.
                // However, using using getContent() won't hurt.
                if (Utils.log) {
                  console.log('got expense. name: ' + event.getContent().name);
                }
                this.multipleNewTransactionsObservable.next([this.getExpenseFromEvent(room, event)]);
              } else if (event.isRelation('m.replace')) {
                if (Utils.log) { console.log('got editing of payback. name: ' + event.getContent().name); }
                this.modifiedTransactionsObservable.next(this.getPaybackFromEvent(room, event));
              }
              break;
            }
            case ('m.room.create'): {
              if (Utils.log) console.log('got a room creation. room: ' + room.name
                + ' creator: ' + event.getContent().creator + ' date: ' + event.getDate());
              this.groupActivityObservable.next(
                {groupId: room.roomId, creatorId: event.getContent().creator, creationDate: event.getDate()}
                );
              break;
            }
          }
        }
      });
  }

  private roomListener(): void {
    // Fires whenever invited to a room or joining a room
    this.matrixClient.on('Room', async room => {
      const roomType = room.getLiveTimeline().getState(EventTimeline.FORWARDS).getStateEvents('org.matrix.msc1840', ' ');
      console.log('---roomType---');
      console.log(room.getLiveTimeline().getState(EventTimeline.FORWARDS));
      console.log(roomType);
      const member = room.getLiveTimeline().getState(EventTimeline.FORWARDS).getMember(this.matrixClient.getUserId());
      if (Utils.log) console.log(member);
      if (Utils.log) console.log(this.matrixClient.getUserId());
      if (member.membership === 'join') {
        await this.processNewRoom(room);
      }
      if (member.membership === 'invite') {
        await this.matrixClient.joinRoom(room.roomId);
      }
    });
  }

  private membershipListener(): void {
    // Fires whenever any room member's membership state changes.
    this.matrixClient.on('RoomMember.membership', (event, member, oldMembership) => {
      const userId = member.userId;
      const groupId = member.roomId;
      if (Utils.log) console.log('membership changed from ' + oldMembership + ' to ' + member.membership + '. room:  ' + groupId + ' member: ' + member.userId);
      if (userId === this.matrixClient.getUserId()) {
        if ((oldMembership === 'invite' || oldMembership === 'leave' || oldMembership === null) && member.membership === 'join') {
          this.groupMembershipObservable.next(
            {groupId, isLeave: false, userId, date: event.getDate(), name: member.name});
        }
        if (oldMembership === 'join' && member.membership === 'leave') {
          if (Utils.log) console.log('user left the room ' + groupId + ' date: ' + event.getDate());
          this.groupsObservable.next({
            groupId, isLeave: true,
            currency: undefined, groupName: undefined, userNames: undefined, userIds: undefined
          });
        }
      } else {
        let isLeave: boolean;
        if (member.membership === 'invite' || member.membership === 'join') {
          isLeave = false;
          if (Utils.log) console.log('membership change: userId: ' + userId + 'isLeave: ' + isLeave + ' date: ' + event.getDate());
        } else if (oldMembership === 'join' && member.membership === 'leave') {
          isLeave = true;
          if (Utils.log) console.log('membership change: userId: ' + userId + 'isLeave: ' + isLeave + ' date: ' + event.getDate());
        }
        this.groupMembershipObservable.next(
          {groupId, isLeave, userId, date: event.getDate(), name: member.name});
      }
    });
  }

  // Fires whenever the live timeline in a room is reset.
  // When a 'limited' sync (for example, after a network outage) is recieved,
  // the live timeline is reset to be empty before the recent events are added to the new timeline.
  private timelineResetListener(): void {
    this.matrixClient.on('Room.timelineReset', (room, timelineSet, resetAllTimelines) => {
      console.log('LiveTimeline in room ' + room.roomId + ' has been reset. Events may have been missed.');
    });
  }

  // other functions

  private getExpenseFromEvent(room, event): TransactionType {
    const content = event.getContent();
    console.log(content);
    return {transactionType: ObservableService.TRANSACTION_TYPE_EXPENSE,
      transactionId: event.getId(),
      name: content.name,
      creationDate: event.getDate(),
      groupId: room.roomId,
      payerId: content.payer,
      payerAmount: this.SumUpRecipientAmounts(content.amounts),
      recipientIds: content.recipients,
      recipientAmounts: content.amounts,
      senderId: event.getSender()};
  }

  private getPaybackFromEvent(room, event): TransactionType {
    console.log('this is getPaybackFromEvent');
    const content = event.getContent();
    return {transactionType: ObservableService.TRANSACTION_TYPE_PAYBACK,
      transactionId: event.getId(),
      name: content.name,
      creationDate: event.getDate(),
      groupId: room.roomId,
      payerId: content.payerId,
      payerAmount: this.SumUpRecipientAmounts(content.amounts), // maybe do that calculation in BasicDataUpdateService
      recipientIds: content.recipientIds,
      recipientAmounts: content.amounts,
      senderId: event.getSender()};
  }

  private SumUpRecipientAmounts(recipientAmounts: number[]): number {
    let sum : number = 0;
    for (let i = 0; i < recipientAmounts.length; i++) {
      sum += recipientAmounts[i];
    }
    return sum;
  }

  public getUserObservable(): Observable<UserType> {
    return this.userObservable;
  }

  public getGroupsObservable(): Observable<GroupsType> {
    return this.groupsObservable;
  }

  public getBalancesObservable(): Observable<BalancesType> {
    return this.balancesObservable;
  }

  public getRecommendationsObservable(): Observable<RecommendationsType> {
    return this.recommendationsObservable;
  }

  public getSettingsCurrencyObservable(): Observable<CurrencyType> {
    return this.settingsCurrencyObservable;
  }

  public getGroupMembershipObservable(): Observable<GroupMemberType> {
    return this.groupMembershipObservable;
  }

  public getModifiedTransactionObservable(): Observable<TransactionType> {
    return this.modifiedTransactionsObservable;
  }

  public getMultipleNewTransactionsObservable(): Observable<TransactionType[]> {
    return this.multipleNewTransactionsObservable;
  }

  public getNewTransactionObservable(): Observable<TransactionType> {
    return this.newTransactionObservable;
  }

  public getSettingsLanguageObservable(): Observable<LanguageType> {
    return this.settingsLanguageObservable;
  }

  public getGroupActivityObservable(): Observable<GroupActivityType> {
    return this.groupActivityObservable;
  }
}
