import {ObservableService} from './observable.service';
import {Observable} from 'rxjs';
import {CurrencyType, GroupActivityType, GroupMemberType, GroupsType, LanguageType, TransactionType} from './parameterTypes';
import {EventEmitter} from 'events';
// @ts-ignore
import {TimelineWindow} from 'matrix-js-sdk';


// create a fake Room with all functionality needed during testing
function fakeRoom(member: object, currency: string, _name: string, _roomId: string): object {
  return {
    name: _name,
    roomId: _roomId,
    getLiveTimeline(): object {
      return {
        getTimelineSet(): object {
          return {};
        },
        getState(direction: string): object {
          return {
            getMember(): any {
                return member;
            },
            getStateEvents(eventType: string, stateKey: string): object {
              if (eventType === 'com.matrixpay.currency') {
                return {
                  getContent(): object {
                    return {
                      currency
                    };
                  }
                };
              }
            }
          };
        }
      };
    }
  };
}


describe('ObservableService', () => {

  const userId = '@id1:dsn.tm.kit.edu';

  let service: ObservableService;

  // Mock client/clientService/LoggedInEmitter
  const mockedClient = jasmine.createSpyObj('MatrixClient',
    ['credentials', 'startClient', 'getUserId', 'getAccountDataFromServer', 'getUser', 'on', 'joinRoom']);
  const clientServiceSpy = jasmine.createSpyObj('MatrixClientService',
    ['getLoggedInEmitter', 'isPrepared', 'getClient', 'getRoomTypeClient']);
  const loggedInEmitter = jasmine.createSpyObj('EventEmitter', ['subscribe']);
  let clientEmitter;

  beforeEach(() => {
    clientEmitter = new EventEmitter();

    // Return the callback of the loggedInEmitter, when somebody subscribes to it
    loggedInEmitter.subscribe.and.callFake((callback: () => void) => {
      callback();
    });

    // Replace the returned loggedInEmitter with the mocked loggedInEmitter in the test
    clientServiceSpy.getLoggedInEmitter.and.returnValue(loggedInEmitter);
    clientServiceSpy.isPrepared.and.returnValue(true);

    // Mock client
    mockedClient.credentials.and.returnValue({userId});
    mockedClient.getUserId.and.returnValue(userId);
    mockedClient.startClient.and.returnValue(Promise.resolve());
    mockedClient.getAccountDataFromServer.and.callFake((type: string) => {
      if (type === 'com.matrixpay.language') {
        return {};
      }

      if (type === 'com.matrixpay.currency') {
        return {};
      }

      return {};
    });

    // note: This fake user may need extension, as it currently only contains the display name
    mockedClient.getUser.and.returnValue({
      displayName: 'John Smith'
    });

    // when something listens to the mockedCient.on method redirect him to the clientEmitter.on method to be able to trigger
    // Events that simulate .on Events from the client
    mockedClient.on.and.callFake((type: string, callback: any) => {
      clientEmitter.on(type, callback);
    });
    mockedClient.joinRoom.and.returnValue({});

    clientServiceSpy.getClient.and.returnValue(mockedClient);

    console.log('service');
    // @ts-ignore
    ObservableService.prototype.paginateBackwardsUntilTheEnd = (window: TimelineWindow): Promise<void> => {
        console.log('wir habens bis hier geschafft :D');
        return Promise.resolve();
    };
    service = new ObservableService(clientServiceSpy);
    console.log(service);

    TimelineWindow.prototype.load = () => {
        console.log('wir haben dich ersetzt');
    };

  });

  it('language observable should emit changes', (done: DoneFn) => {

    const languageObservable: Observable<LanguageType> = service.getSettingsLanguageObservable();
    languageObservable.subscribe((language: LanguageType) => {
      console.log('callback called');
      expect(language.language).toEqual('ENGLISH');
      done();
    });

    clientEmitter.emit('accountData',
        {
          getType(): string {
            return 'com.matrixpay.language';
          },
          getContent(): object {
            return {language: 'ENGLISH'};
          },
        },
        {});
  });

  it('check invite', () => {

    clientEmitter.emit('Room',
        fakeRoom({
            membership: 'invite'
        }, 'USD', 'name1', 'room1'),
        {});

    expect(mockedClient.joinRoom).toHaveBeenCalled();
  });

  it('check membership join', (done: DoneFn) => {

    const d1 = new Date('December 17, 1995 03:24:00');

    const groupMemberShipObservable: Observable<GroupMemberType> = service.getGroupMembershipObservable();
    groupMemberShipObservable.subscribe((member: GroupMemberType) => {

      expect(member.groupId).toBe('room1');
      expect(member.date).toBe(d1);
      expect(member.isLeave).toBe(false);
      expect(member.name).toBe('name1');
      expect(member.userId).toBe(userId);

      done();
    });

    clientEmitter.emit('RoomMember.membership',
        {
          getDate(): Date {
            return d1;
          },
        },
        {
          userId,
          name: 'name1',
          roomId: 'room1',
          membership: 'join'
        },
        'invite'
    );
  });

  it('check membership leave', (done: DoneFn) => {

    const d1 = new Date('December 17, 1995 03:24:00');


    const groupObservable: Observable<GroupsType> = service.getGroupsObservable();
    groupObservable.subscribe((group: GroupsType) => {

      expect(group.groupId).toBe('room1');
      expect(group.groupName).toBe(undefined);
      expect(group.isLeave).toBe(true);
      expect(group.currency).toBe(undefined);
      expect(group.userIds).toBe(undefined);
      expect(group.userNames).toBe(undefined);


      done();
    });

    clientEmitter.emit('RoomMember.membership',
        {
          getDate(): Date {
            return d1;
          },
        },
        {
          userId,
          name: 'name1',
          roomId: 'room1',
          membership: 'leave'
        },
        'join'
    );
  });

  it('check membership other join', (done: DoneFn) => {

    const d1 = new Date('December 17, 1995 03:24:00');

    const groupMemberShipObservable: Observable<GroupMemberType> = service.getGroupMembershipObservable();
    groupMemberShipObservable.subscribe((member: GroupMemberType) => {

      expect(member.groupId).toBe('room1');
      expect(member.date).toBe(d1);
      expect(member.isLeave).toBe(false);
      expect(member.name).toBe('name2');
      expect(member.userId).toBe('id2');

      done();
    });

    clientEmitter.emit('RoomMember.membership',
        {
          getDate(): Date {
            return d1;
          },
        },
        {
          userId: 'id2',
          name: 'name2',
          roomId: 'room1',
          membership: 'join'
        },
        'invite'
    );
  });

  it('check membership other leave', (done: DoneFn) => {

    const d1 = new Date('December 17, 1995 03:24:00');

    const groupMemberShipObservable: Observable<GroupMemberType> = service.getGroupMembershipObservable();
    groupMemberShipObservable.subscribe((member: GroupMemberType) => {

      expect(member.groupId).toBe('room1');
      expect(member.date).toBe(d1);
      expect(member.isLeave).toBe(true);
      expect(member.name).toBe('name2');
      expect(member.userId).toBe('id2');

      done();
    });

    clientEmitter.emit('RoomMember.membership',
        {
          getDate(): Date {
            return d1;
          },
        },
        {
          userId: 'id2',
          name: 'name2',
          roomId: 'room1',
          membership: 'leave'
        },
        'join'
    );
  });

  it('currency observable should emit changes', (done: DoneFn) => {

    const currencyObservable: Observable<CurrencyType> = service.getSettingsCurrencyObservable();
    currencyObservable.subscribe((currency: CurrencyType) => {
      console.log('callback called');
      expect(currency.currency).toBe('EUR');
      done();
    });

    clientEmitter.emit('accountData',
      {
        getType(): string {
          return 'com.matrixpay.currency';
        },
        getContent(): object {
          return {currency: 'EUR'};
        },
      },
      {});
  });

  it('message expense test edit', (done: DoneFn) => {

    const d1 = new Date('December 17, 1995 03:24:00');
    const room = {roomId: 'room1'};
    // @ts-ignore
    const type = ObservableService.TRANSACTION_TYPE_EXPENSE;

    const modifiedObservable: Observable<TransactionType> = service.getModifiedTransactionObservable();
    modifiedObservable.subscribe((transaction: TransactionType) => {
        expect(transaction).toEqual(
            {transactionType: type,
                transactionId: 't2',
                name: 'name_t2',
                creationDate: d1,
                groupId: 'room1',
                payerId: userId,
                recipientIds: ['id2', 'id3', 'id4', 'id5'],
                recipientAmounts: [9, 5, 3, 7],
                senderId: userId}
        );

        done();
    });

    clientEmitter.emit('Room.timeline',
        {
            getType(): string {
                return 'com.matrixpay.expense';
            },
            getContent(): object {
                return {
                    name: 'name_t2',
                    payer: userId,
                    amounts: [9, 5, 3, 7],
                    recipients: ['id2', 'id3', 'id4', 'id5'],
                };
            },
            getId(): string {
                return 't2';
            },
            getDate(): Date {
                return d1;
            },
            getSender(): string {
                return userId;
            },
            isRelation(relation: string): boolean {
                return true;
            }
        },
        room, {}, {}, {liveEvent: false, }
    );
  });

  it('message create room test', (done: DoneFn) => {

    const d1 = new Date('December 17, 1995 03:24:00');
    const room = {roomId: 'room1'};

    const activityObservable: Observable<GroupActivityType> = service.getGroupActivityObservable();
    activityObservable.subscribe((activity: GroupActivityType) => {
        expect(activity).toEqual(
            {groupId: room.roomId, creatorId: userId, creationDate: d1}
        );
        done();
    });

    clientEmitter.emit('Room.timeline',
        {
            getType(): string {
                return 'm.room.create';
            },
            getContent(): object {
                return {
                    creator: userId,
                };
            },
            getDate(): Date {
                return d1;
            }
        },
        room, {}, {}, {liveEvent: false, }
    );
  });

  it('message room member join', (done: DoneFn) => {

    const d1 = new Date('December 17, 1995 03:24:00');
    const room = {
        roomId: 'room1',
        getMember(key: any): object {
            return {user: {displayName: 'displayName1'}};
        }
    };

    const membershipObservable: Observable<GroupMemberType> = service.getGroupMembershipObservable();
    membershipObservable.subscribe((member: GroupMemberType) => {
        expect(member).toEqual(
            {groupId: room.roomId, userId, date: d1, isLeave: false, name: 'displayName1'}
        );
        done();
    });

    clientEmitter.emit('Room.timeline',
        {
            getType(): string {
                return 'm.room.member';
            },
            getStateKey(): string {
                return userId;
            },
            getContent(): object {
                return {
                    membership: 'join',
                };
            },
            getDate(): Date {
                return d1;
            }
        }, room, {}, {}, {liveEvent: false, }
    );
  });

  it('message room member leave', (done: DoneFn) => {

    const d1 = new Date('December 17, 1995 03:24:00');
    const room = {
        roomId: 'room1',
        getMember(key: any): object {
            return {user: {displayName: 'displayName1'}};
        }
    };

    const membershipObservable: Observable<GroupMemberType> = service.getGroupMembershipObservable();
    membershipObservable.subscribe((member: GroupMemberType) => {
        expect(member).toEqual(
            {groupId: room.roomId, userId, date: d1, isLeave: true, name: 'displayName1'}
        );
        done();
    });

    clientEmitter.emit('Room.timeline',
        {
            getType(): string {
                return 'm.room.member';
            },
            getStateKey(): string {
                return userId;
            },
            getContent(): object {
                return {
                    membership: 'leave',
                };
            },
            getDate(): Date {
                return d1;
            }
        }, room, {}, {}, {liveEvent: false, }
    );
  });

  it('message create room new test', (done: DoneFn) => {

    const d1 = new Date('December 17, 1995 03:24:00');
    const room = {roomId: 'room1'};

    const activityObservable: Observable<GroupActivityType> = service.getGroupActivityObservable();
    activityObservable.subscribe((activity: GroupActivityType) => {
        expect(activity).toEqual(
            {groupId: room.roomId, creatorId: userId, creationDate: d1}
        );
        done();
    });

    clientEmitter.emit('Room.timeline',
        {
            getType(): string {
                return 'm.room.create';
            },
            getContent(): object {
                return {
                    creator: userId,
                };
            },
            getDate(): Date {
                return d1;
            }
        },
        room, {}, {}, {liveEvent: true, }
    );
  });

  it('message payback test', (done: DoneFn) => {

    const d1 = new Date('December 17, 1995 03:24:00');
    const room = {roomId: 'room1'};
    // @ts-ignore
    const type = ObservableService.TRANSACTION_TYPE_PAYBACK;

    const messageObservable: Observable<TransactionType[]> = service.getMultipleNewTransactionsObservable();
    messageObservable.subscribe((transactions: TransactionType[]) => {
        expect(transactions).toEqual(
            [{transactionType: type,
                transactionId: 't1',
                name: 'name_t1',
                creationDate: d1,
                groupId: 'room1',
                payerId: userId,
                recipientIds: ['id2', 'id3', 'id4', 'id5'],
                recipientAmounts: [9, 5, 3, 7],
                senderId: userId}]
        );
        done();
    });

    clientEmitter.emit('Room.timeline',
        {
            getType(): string {
                return 'com.matrixpay.payback';
            },
            getContent(): object {
                return {
                    name: 'name_t1',
                    payer: userId,
                    amounts: [9, 5, 3, 7],
                    recipients: ['id2', 'id3', 'id4', 'id5'],
                };
            },
            getId(): string {
                return 't1';
            },
            getDate(): Date {
                return d1;
            },
            getSender(): string {
                return userId;
            }
        },
        room, {}, {}, {liveEvent: true, }
    );
  });

  it('message expense test', (done: DoneFn) => {

    const d1 = new Date('December 17, 1995 03:24:00');
    const room = {roomId: 'room1'};
    // @ts-ignore
    const type = ObservableService.TRANSACTION_TYPE_EXPENSE;

    const messageObservable: Observable<TransactionType[]> = service.getMultipleNewTransactionsObservable();
    messageObservable.subscribe((transactions: TransactionType[]) => {
        expect(transactions).toEqual(
            [{transactionType: type,
                transactionId: 't2',
                name: 'name_t2',
                creationDate: d1,
                groupId: 'room1',
                payerId: userId,
                recipientIds: ['id2', 'id3', 'id4', 'id5'],
                recipientAmounts: [9, 5, 3, 7],
                senderId: userId}]
        );
        done();
    });

    clientEmitter.emit('Room.timeline',
        {
            getType(): string {
                return 'com.matrixpay.expense';
            },
            getContent(): object {
                return {
                    name: 'name_t2',
                    payer: userId,
                    amounts: [9, 5, 3, 7],
                    recipients: ['id2', 'id3', 'id4', 'id5'],
                };
            },
            getId(): string {
                return 't2';
            },
            getDate(): Date {
                return d1;
            },
            getSender(): string {
                return userId;
            },
            isRelation(): boolean {
                return false;
            }
        },
        room, {}, {}, {liveEvent: true, }
    );
  });

  it('message expense test edit', (done: DoneFn) => {

    const d1 = new Date('December 17, 1995 03:24:00');
    const room = {roomId: 'room1'};
    // @ts-ignore
    const type = ObservableService.TRANSACTION_TYPE_EXPENSE;

    const modifiedObservable: Observable<TransactionType> = service.getModifiedTransactionObservable();
    modifiedObservable.subscribe((transaction: TransactionType) => {
        expect(transaction).toEqual(
            {transactionType: type,
                transactionId: 't2',
                name: 'name_t2',
                creationDate: d1,
                groupId: 'room1',
                payerId: userId,
                recipientIds: ['id2', 'id3', 'id4', 'id5'],
                recipientAmounts: [9, 5, 3, 7],
                senderId: userId}
        );
        done();
    });

    clientEmitter.emit('Room.timeline',
        {
            getType(): string {
                return 'com.matrixpay.expense';
            },
            getContent(): object {
                return {
                    name: 'name_t2',
                    payer: userId,
                    amounts: [9, 5, 3, 7],
                    recipients: ['id2', 'id3', 'id4', 'id5'],
                };
            },
            getId(): string {
                return 't2';
            },
            getDate(): Date {
                return d1;
            },
            getSender(): string {
                return userId;
            },
            isRelation(relation: string): boolean {
                return true;
            }
        },
        room, {}, {}, {liveEvent: true, }
    );
  });

  it('check join', (done: DoneFn) => {
    const groupObservable: Observable<GroupsType> = service.getGroupsObservable();
    groupObservable.subscribe((group: GroupsType) => {
        expect(group.currency).toBe('USD');
        expect(group.groupId).toBe('room1');
        expect(group.groupName).toBe('name1');
        expect(group.isLeave).toBe(false);
        expect(group.userIds).toEqual([]);
        expect(group.userNames).toEqual([]);

        done();
    });


    clientEmitter.emit('Room',
        fakeRoom({
            membership: 'join'
        }, 'USD', 'name1', 'room1'),
        {}
      );
  });

  it('message payback test room', (done: DoneFn) => {

      console.log('i got called here');

      const d1 = new Date('December 17, 1995 03:24:00');
      const room = fakeRoom({
          membership: 'join'
      }, 'USD', 'name1', 'room1');
      // @ts-ignore
      const type = ObservableService.TRANSACTION_TYPE_PAYBACK;

      // @ts-ignore
      ObservableService.prototype.paginateBackwardsUntilTheEnd = (window: TimelineWindow): Promise<void> => {
          console.log('called1');
          clientEmitter.emit('Room.timeline',
              {
                  getType(): string {
                      return 'com.matrixpay.payback';
                  },
                  getContent(): object {
                      return {
                          name: 'name_t1',
                          payer: userId,
                          amounts: [9, 5, 3, 7],
                          recipients: ['id2', 'id3', 'id4', 'id5'],
                      };
                  },
                  getId(): string {
                      return 't1';
                  },
                  getDate(): Date {
                      return d1;
                  },
                  getSender(): string {
                      return userId;
                  }
              },
              room, {}, {}, {liveEvent: false, }
          );
          return Promise.resolve();
      };
      clientEmitter.removeAllListeners();
      service = new ObservableService(clientServiceSpy);


      const transactionsObservable: Observable<TransactionType[]> = service.getMultipleNewTransactionsObservable();
      transactionsObservable.subscribe((transactions: TransactionType[]) => {
          console.log('testing now');
          console.log(transactions);
          expect(transactions).toEqual([
              {transactionType: type,
                  transactionId: 't1',
                  name: 'name_t1',
                  creationDate: d1,
                  groupId: 'room1',
                  payerId: userId,
                  recipientIds: ['id2', 'id3', 'id4', 'id5'],
                  recipientAmounts: [9, 5, 3, 7],
                  senderId: userId}
          ]);

          done();
      });


      clientEmitter.emit('Room',
        room,
        {}
    );
  });

  it('message expense test room', (done: DoneFn) => {

    console.log('i got called here');

    const d1 = new Date('December 17, 1995 03:24:00');
    const room = fakeRoom({
        membership: 'join'
    }, 'USD', 'name1', 'room1');
    // @ts-ignore
    const type = ObservableService.TRANSACTION_TYPE_EXPENSE;

    // @ts-ignore
    ObservableService.prototype.paginateBackwardsUntilTheEnd = (window: TimelineWindow): Promise<void> => {
        console.log('called1');
        clientEmitter.emit('Room.timeline',
            {
                getType(): string {
                    return 'com.matrixpay.expense';
                },
                getContent(): object {
                    return {
                        name: 'name_t2',
                        payer: userId,
                        amounts: [9, 5, 3, 7],
                        recipients: ['id2', 'id3', 'id4', 'id5'],
                    };
                },
                getId(): string {
                    return 't2';
                },
                getDate(): Date {
                    return d1;
                },
                getSender(): string {
                    return userId;
                },
                isRelation(): boolean {
                    return false;
                }
            },
            room, {}, {}, {liveEvent: false, }
        );
        return Promise.resolve();
    };
    clientEmitter.removeAllListeners();
    service = new ObservableService(clientServiceSpy);


    const transactionsObservable: Observable<TransactionType[]> = service.getMultipleNewTransactionsObservable();
    transactionsObservable.subscribe((transactions: TransactionType[]) => {
        console.log('testing now');
        console.log(transactions);
        expect(transactions).toEqual([
            {transactionType: type,
                transactionId: 't2',
                name: 'name_t2',
                creationDate: d1,
                groupId: 'room1',
                payerId: userId,
                recipientIds: ['id2', 'id3', 'id4', 'id5'],
                recipientAmounts: [9, 5, 3, 7],
                senderId: userId}
        ]);

        done();
    });

    clientEmitter.emit('Room',
        room,
        {}
    );
  });

});
