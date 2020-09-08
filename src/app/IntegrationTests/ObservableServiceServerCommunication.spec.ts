import {ObservableService} from '../ServerCommunication/CommunicationInterface/observable.service';
import {Observable} from 'rxjs';
import {CurrencyType, GroupActivityType, GroupMemberType, GroupsType, LanguageType, TransactionType} from '../ServerCommunication/CommunicationInterface/parameterTypes';
import {EventEmitter} from 'events';
// @ts-ignore
import {TimelineWindow} from 'matrix-js-sdk';
import {MatrixBasicDataService} from '../ServerCommunication/CommunicationInterface/matrix-basic-data.service';
import {GroupService} from '../ServerCommunication/GroupCommunication/group.service';
import {Currency, matrixCurrencyMap} from '../DataModel/Utils/Currency';
import {SettingsService} from '../ServerCommunication/SettingsCommunication/settings.service';
import {TransactionService} from '../ServerCommunication/GroupCommunication/transaction.service';
import {MatrixEmergentDataService} from '../ServerCommunication/CommunicationInterface/matrix-emergent-data.service';


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


describe('Integration ObservableService ServerCommunication', () => {

    const userId = '@id1:dsn.tm.kit.edu';

    let observableService: ObservableService;
    let basicDataService: MatrixBasicDataService;
    let groupService: GroupService;
    let settingsService: SettingsService;
    let transactionService: TransactionService;
    let emergentDataService: MatrixEmergentDataService;

    // Mock client/clientService/LoggedInEmitter
    const mockedClient = jasmine.createSpyObj('MatrixClient',
        ['credentials', 'startClient', 'getUserId', 'getAccountDataFromServer', 'getUser', 'on', 'joinRoom', 'setAccountData',
            'sendEvent', 'createRoom', 'leave', 'getRoom', 'invite']);
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
        observableService = new ObservableService(clientServiceSpy);
        transactionService = new TransactionService(clientServiceSpy);
        emergentDataService = new MatrixEmergentDataService(clientServiceSpy);
        groupService = new GroupService(transactionService, clientServiceSpy, emergentDataService);
        settingsService = new SettingsService(clientServiceSpy);
        basicDataService = new MatrixBasicDataService(groupService, settingsService);

        TimelineWindow.prototype.load = () => {
            console.log('wir haben dich ersetzt');
        };

    });

    it('integration send and receive currency', (done: DoneFn) => {

        const currencyObservable: Observable<CurrencyType> = observableService.getSettingsCurrencyObservable();
        currencyObservable.subscribe((currency: CurrencyType) => {
            console.log('callback called');
            expect(currency.currency).toEqual('EUR');
            done();
        });

        mockedClient.setAccountData.and.callFake((param1, param2) => {
            clientEmitter.emit('accountData',
                {
                    getType(): string {
                        return param1;
                    },
                    getContent(): object {
                        return param2;
                    },
                },
                {});
            return Promise.resolve();
        });
        basicDataService.userChangeDefaultCurrency(matrixCurrencyMap[Currency.EUR]);
    });

    it('integration send and receive language', (done: DoneFn) => {

        const languageObservable: Observable<LanguageType> = observableService.getSettingsLanguageObservable();
        languageObservable.subscribe((language: LanguageType) => {
            console.log('callback called');
            expect(language.language).toEqual('ENGLISH');
            done();
        });

        mockedClient.setAccountData.and.callFake((param1, param2) => {
            clientEmitter.emit('accountData',
                {
                    getType(): string {
                        return param1;
                    },
                    getContent(): object {
                        return param2;
                    },
                },
                {});
            return Promise.resolve();
        });
        basicDataService.userChangeLanguage('ENGLISH');
    });

    it('integration create room activity emitted', (done: DoneFn) => {

        const d1 = new Date('December 17, 1995 03:24:00');
        const room = {roomId: 'room1'};

        const activityObservable: Observable<GroupActivityType> = observableService.getGroupActivityObservable();
        activityObservable.subscribe((activity: GroupActivityType) => {
            expect(activity).toEqual(
                {groupId: room.roomId, creatorId: userId, creationDate: d1}
            );
            done();
        });

        mockedClient.createRoom.and.callFake((param1) => {
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

        basicDataService.groupCreate('name_1', matrixCurrencyMap[Currency.EUR]);
    });

    it('integration send and receive expense', (done: DoneFn) => {

        const d1 = new Date('December 17, 1995 03:24:00');
        const room = {roomId: 'room1'};
        // @ts-ignore
        const type = ObservableService.TRANSACTION_TYPE_EXPENSE;

        const messageObservable: Observable<TransactionType[]> = observableService.getMultipleNewTransactionsObservable();
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

        mockedClient.sendEvent.and.callFake((roomId, eventType, content) => {
            clientEmitter.emit('Room.timeline',
                {
                    getType(): string {
                        return eventType;
                    },
                    getContent(): object {
                        return  content;
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
        basicDataService.createTransaction('room1', 'name_t2', userId, ['id2', 'id3', 'id4', 'id5'], [9, 5, 3, 7], false);
    });

    it('integration send and receive payback', (done: DoneFn) => {

        const d1 = new Date('December 17, 1995 03:24:00');
        const room = {roomId: 'room1'};
        // @ts-ignore
        const type = ObservableService.TRANSACTION_TYPE_PAYBACK;

        const messageObservable: Observable<TransactionType[]> = observableService.getMultipleNewTransactionsObservable();
        messageObservable.subscribe((transactions: TransactionType[]) => {
            expect(transactions).toEqual(
                [{transactionType: type,
                    transactionId: 't2',
                    name: 'name_t2',
                    creationDate: d1,
                    groupId: 'room1',
                    payerId: userId,
                    recipientIds: ['id2'],
                    recipientAmounts: [9],
                    senderId: userId}]
            );
            done();
        });

        mockedClient.sendEvent.and.callFake((roomId, eventType, content) => {
            clientEmitter.emit('Room.timeline',
                {
                    getType(): string {
                        return eventType;
                    },
                    getContent(): object {
                        return  content;
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

        basicDataService.createTransaction('room1', 'name_t2', userId, ['id2'], [9], true);
    });

    it('integration check if groups observable emits when user leaves group', (done: DoneFn) => {

        const d1 = new Date('December 17, 1995 03:24:00');


        const groupObservable: Observable<GroupsType> = observableService.getGroupsObservable();
        groupObservable.subscribe((group1: GroupsType) => {

            expect(group1.groupId).toBe('room1');
            expect(group1.groupName).toBe(undefined);
            expect(group1.isLeave).toBe(true);
            expect(group1.currency).toBe(undefined);
            expect(group1.userIds).toBe(undefined);
            expect(group1.userNames).toBe(undefined);


            done();
        });

        mockedClient.getRoom.and.callFake((groupId) => ( {} ));
        mockedClient.leave.and.callFake((groupId) => {
            clientEmitter.emit('RoomMember.membership',
                {
                    getDate(): Date {
                        return d1;
                    },
                },
                {
                    userId,
                    name: 'name1',
                    roomId: groupId,
                    membership: 'leave'
                },
                'join'
            );
        });

        basicDataService.leaveGroup('room1');


    });

    it('integration add other member to group', (done: DoneFn) => {

        const d1 = new Date('December 17, 1995 03:24:00');

        const groupMemberShipObservable: Observable<GroupMemberType> = observableService.getGroupMembershipObservable();
        groupMemberShipObservable.subscribe((member: GroupMemberType) => {

            expect(member.groupId).toBe('room1');
            expect(member.date).toBe(d1);
            expect(member.isLeave).toBe(false);
            expect(member.name).toBe('name1');
            expect(member.userId).toBe('user_id_2');

            done();
        });

        mockedClient.invite.and.callFake((groupId, inputUserId) => {
            clientEmitter.emit('RoomMember.membership',
                {
                    getDate(): Date {
                        return d1;
                    },
                },
                {
                    userId: inputUserId,
                    name: 'name1',
                    roomId: groupId,
                    membership: 'join'
                },
                'invite'
            );
        });

        basicDataService.groupAddMember('room1', 'user_id_2');

    });

});
