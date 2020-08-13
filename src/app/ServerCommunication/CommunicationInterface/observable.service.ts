import {Injectable} from '@angular/core';
import {ObservableInterface} from './observableInterface';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs'; // Subjects are multicast Observables
import {GroupsType, BalancesType, GroupMemberType, RecommendationsType, CurrencyType, UserType} from './parameterTypes';
// @ts-ignore
import {MatrixClient, MatrixEvent, EventTimeline, EventTimelineSet, TimelineWindow, Room, Filter, FilterComponent} from 'matrix-js-sdk';
import {Utils} from '../Response/Utils';
import {MatrixClientService} from "./matrix-client.service";
import {ClientInterface} from "./ClientInterface";

@Injectable({
  providedIn: 'root'
})
export class ObservableService implements ObservableInterface {
  private matrixClient: MatrixClient;
  private clientService: ClientInterface;
  private userObservable: Subject<UserType>;
  private groupsObservable: Subject<GroupsType>;
  private balancesObservable: Subject<BalancesType>;
  private recommendationsObservable: Subject<RecommendationsType>;
  private settingsCurrencyObservable: Subject<CurrencyType>;
  // TODO: remove magic numbers
  private window: TimelineWindow; // for testing, is only extended backwards

  constructor(clientService: MatrixClientService) {
    this.clientService = clientService;

    if (Utils.log) console.log('this is ObservableService');
    this.userObservable = new Subject();
    this.groupsObservable = new Subject();
    this.balancesObservable = new Subject();
    this.recommendationsObservable = new Subject();
    this.settingsCurrencyObservable = new Subject();

    this.setUp();
  }

  // for testing
  public scroll(): void {
    console.log(this.window.canPaginate(EventTimeline.BACKWARDS));
    const tl = this.window.getTimelineIndex(EventTimeline.BACKWARDS);
    if (!tl) {
      console.log('TimelineWindow: no timeline yet');
    }
    if (tl.index > tl.minIndex()) {
      console.log('canPaginate');
    }
    console.log('neighboring timeline or pagination token available: ' +  Boolean(tl.timeline.getNeighbouringTimeline(EventTimeline.BACKWARDS) ||
      tl.timeline.getPaginationToken(EventTimeline.BACKWARDS)));
    this.window.paginate(EventTimeline.BACKWARDS, 10);
    console.log('scrolled');
  }

  private async setUp(): Promise<void> {
    // wait until client is set in constructor
    this.matrixClient = await this.clientService.getLoggedInClient();

    // Getting data about the user
    const userId = this.matrixClient.getUserId();
    // test: does not give the displayName, but the userId
    const name = this.matrixClient.getUser(userId).displayName;
    // use getAccountDataFromServer instead of getAccountData in case the initial sync is not complete
    const currencyEventContent = await this.matrixClient.getAccountDataFromServer('currency') // content of the matrix event
      .catch(() => {if (Utils.log) console.log('rejected promise while getting account data from server'); });
    if (Utils.log) console.log(currencyEventContent);
    /* When setting language is implemented in login component:
       const languageEventContent = await matrixClient.getAccountDataFromServer('language');
       if (Utils.log) console.log(languageEventContent);*/
    this.userObservable.next({contactId: userId, name,
      currency: currencyEventContent.currency, /*language: languageEventContent.language*/ language: 'ENGLISH'});

    // wait until initial sync is done
    const syncPromise = new Promise((resolve, reject) => {
      this.matrixClient.on('sync', (state, payload) => {
        if (state === 'SYNCING') {
          resolve();
        } else if (state === 'ERROR'){
          console.log('error while syncing');
        }
      });
    });
    await syncPromise;
    console.log(this.matrixClient.getSyncStateData());

    // Get data about the rooms (and transfer the information to BasicDataUpdateService,
    // so that future events can be stored in an existing group)
    // more importantly: initialise the timelines (in processNewRoom) for backpagination.
    await this.getRooms();

    // start the matrix listeners
    this.listenToMatrix();

  }

  public async tearDown(): Promise<void> {
  // TODO: implement
  }

  // probably nor needed anymore
  private async getRooms(): Promise<void> {
    // We have to wait until the initial sync is done, because we want to get the rooms from the local store.
    // This implies that the matrix listeners do not detect the events retrieved by the initial sync
    // because they already are in the local store.
    // Waiting is now done in setUp().
    /*const syncPromise = new Promise((resolve, reject) => {
      this.matrixClient.on('sync', (state, payload) => {
        if (state === 'SYNCING') {
          resolve();
        } else if (state === 'ERROR'){
          console.log('error while syncing');
        }
      });
    });
    await syncPromise;*/

    const rooms = this.matrixClient.getRooms(); // returns an array of sdk-Rooms, empty if there are none
    console.log(rooms);
    // forin does not work (does not get correct references of individual rooms), no idea why
    for (let i = 0; i < rooms.length; i++) {
      this.processNewRoom(rooms[i]);
    }
  }

  private async processNewRoom(room: Room): Promise<void> {
    // TODO: check whether it is a MatrixPay room
    // console.log(room);
    const members = room.getLiveTimeline().getState(EventTimeline.FORWARDS).members;
    const groupId = room.roomId;
    const groupName = room.name;
    let userIds = [];
    let userNames = [];
    for (const id in members) {
      userIds.push(id);
      userNames.push(members[id].name);
    }
    // currency is detected a second time by the other event listener (not any more),
    // but needed here for the observable (in DataModel for the group constructor)
    const currencyEvent = room.getLiveTimeline().getState(EventTimeline.FORWARDS).getStateEvents("currency", " ");
    let currency: string;
    console.log(currencyEvent);
    // See the sdk code of getStateEvents() for explanation
    if (currencyEvent === null) {
      // no such event type or no valid events with this event type and state key
      console.log('no currency set');
    } else if (Array.isArray(currencyEvent)) {
      // extra check because currencyEvent === [] did not work
      if (currencyEvent.length === 0) {
        console.log('no currency set');
      } else {
        // event type ok, stateKey undefined (should not happen because we set stateKey to " ".)
        console.log('stateKey undefinded');
      }
    } else {
      currency = currencyEvent.getContent().currency;
      console.log(currencyEvent.getContent().currency);
    }
    console.log('new room detected. groupName: ' + groupName + ' userIds: ' + userIds + ' userNames: ' + userNames);
    // As long as we do not filter for paygroups, set currency to 'EURO' for testing
    this.groupsObservable.next({
      groupId, groupName, /*currency*/ currency: 'EURO', userIds,
      userNames, isLeave: false
    });

    // Get all transactions in the newly joined room.
    // The things written into the local store of the client will eventually be detected by the listeners.
    /*console.log('---window---');
    const timelineWindow = new TimelineWindow(this.matrixClient, room.getLiveTimeline().getTimelineSet(), {timelineSupport: true});
    timelineWindow.load();
    if (!timelineWindow.canPaginate(EventTimeline.BACKWARDS)) { console.log('pagination in room ' + room.name + ' failed'); }
    console.log('canPaginate in room ' + room.name + ': ' + timelineWindow.canPaginate(EventTimeline.BACKWARDS));*/

    console.log('---new timelineSet---');
    // TODO: set the content of the filter
    const filterDefinition: object = {room: {}};
    const filter: Filter = await this.matrixClient.createFilter({});
    console.log(filter);
    filter.setDefinition(filterDefinition);
    // TypeError: matrix_js_sdk__WEBPACK_IMPORTED_MODULE_3__.FilterComponent is not a constructor
    // filter._room_timeline_filter = new FilterComponent({});
    const ownTimelineSet = room.getOrCreateFilteredTimelineSet(filter);
    // TypeError: timelineFilter.getRoomTimelineFilterComponent is not a function
    // let ownTimelineSet = this.createFilteredTimelineSetWithoutPopulatingIt(room, this.matrixClient.createFilter({}));
    console.log(ownTimelineSet);
    const ownTimelineWindow = new TimelineWindow(this.matrixClient, ownTimelineSet);
    ownTimelineWindow.load();
    console.log(ownTimelineWindow.canPaginate(EventTimeline.BACKWARDS));
    ownTimelineWindow.paginate(EventTimeline.BACKWARDS, 2);
    /*await this.matrixClient.paginateEventTimeline(ownTimeline, {backwards: true, limit: 2})
      .then(moreEvents => {
        if (!moreEvents) {
          return;
        }
      });*/

  }


  private async listenToMatrix(): Promise<void> {
    // listen to Matrix Events, use next() on Subjects
    // TODO: error handling
    // TODO: detect transactions, modified transactions
    // TODO: listen for name changes

    if (Utils.log) console.log('ObservableService is listening to Matrix');

    console.log('ObservableService is listening to Matrix');

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

    /*
    // now done in 'Room.membership'-Listener so that a date can be retrieved with event.getDate()
    // Fires whenever invited to a room or joining a room
        this.matrixClient.on('Room', room => {
      const members = room.getLiveTimeline().getState(EventTimeline.FORWARDS).members;
      if (!(members[this.matrixClient.getUserId()].membership === 'join')) {
        return;
      }
      this.processNewRoom(room);
    });
    */

    // Fires whenever the timeline in a room is updated
    this.matrixClient.on('Room.timeline',
      (event, room, toStartOfTimeline, removed, data) => {
      // if (Utils.log) console.log('got a timeline change. event type: '  + event.getType());
      console.log('got a timeline change. event type: '  + event.getType());
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
            console.log('got payback. name: ' + event.getContent().name +  ' date: ' + event.getDate());
            break;
          }*/
        }
      } else {
        if (Utils.log) console.log('got old timeline event');
        switch (event.getType()) {
          // Only for the history! New rooms are detected elsewhere.
          case ('m.room.create'): {
            console.log('got room creation. creator: ' + event.getContent().creator + ' date: ' + event.getDate());
            break;
          }
        }
      }
    });

    // Fires whenever any room member's membership state changes.
    this.matrixClient.on('RoomMember.membership', (event, member, oldMembership) => {
      const userId = member.userId;
      const groupId = member.roomId;
      if (userId === this.matrixClient.getUserId()) {
        if ((oldMembership === 'invite' || oldMembership === 'leave') && member.membership === 'join') {
          this.processNewRoom(this.matrixClient.getRoom(groupId));
          // TODO call next() on observable for activity
          console.log('user joined the room ' + this.matrixClient.getRoom(groupId).name + ' date: ' + event.getDate());
        } else if (oldMembership === 'join' && member.membership === 'leave') {
          console.log('user left the room ' + this.matrixClient.getRoom(groupId).name + ' date: ' + event.getDate());
          // TODO: call next() on observable
        }
      } else {
        let isLeave: boolean;
        if ((oldMembership === 'invite' || oldMembership === 'leave') && member.membership === 'join') {
          isLeave = false;
        } else if (oldMembership === 'join' && member.membership === 'leave') {
          isLeave = true;
        }
        console.log('membership change: userId: ' + userId + 'isLeave: ' + isLeave + ' date: ' + event.getDate());
        // TODO: call next() on observable
      }
    });

    // probably not needed
    // Fires whenever the event dictionary in room state is updated.
    this.matrixClient.on('RoomState.events', (event, state, prevEvent) => {
      if (event.getType() === 'currency') {
        const newCurrency = event.getContent().currency;
        if (Utils.log) console.log('got change of room currency. room: ' + state.roomId + ' new currency: ' + newCurrency);
        // TODO: call next() on observable
      }
    });
  }

  // similar to Room.prototype.getOrCreateFilteredTimelineSet
  private createFilteredTimelineSetWithoutPopulatingIt(room: Room, filter: Filter): void {
    const opts = {timelineSupport: true, filter: filter};
    const timelineSet = new EventTimelineSet(room, opts);
    /* not sure what that does
    room.reEmitter.reEmit(timelineSet, ["Room.timeline", "Room.timelineReset"]);
    room._filteredTimelineSets[filter.filterId] = timelineSet;
    room._timelineSets.push(timelineSet);*/

    const unfilteredLiveTimeline = room.getLiveTimeline();

    // find the earliest unfiltered timeline
    let timeline = unfilteredLiveTimeline;
    while (timeline.getNeighbouringTimeline(EventTimeline.BACKWARDS)) {
      timeline = timeline.getNeighbouringTimeline(EventTimeline.BACKWARDS);
    }

    timelineSet.getLiveTimeline().setPaginationToken(
      timeline.getPaginationToken(EventTimeline.BACKWARDS),
      EventTimeline.BACKWARDS,
    );

    return timelineSet;
  }

  private canPaginateWithHelpfulLog(window: TimelineWindow, direction: string): boolean {
    const tl = window.getTimelineIndex(direction);
    if (!tl) {
      console.log("TimelineWindow: no timeline yet");
      return false;
    }
    if (direction === EventTimeline.BACKWARDS) {
      if (tl.index > tl.minIndex()) {
        return true;
      }
    } else {
      if (tl.index < tl.maxIndex()) {
        return true;
      }
    }
    return Boolean(tl.timeline.getNeighbouringTimeline(direction) ||
      tl.timeline.getPaginationToken(direction));
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
}
