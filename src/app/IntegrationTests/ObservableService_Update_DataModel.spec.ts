import {ObservableService} from '../ServerCommunication/CommunicationInterface/observable.service';
import {EventEmitter} from 'events';
// @ts-ignore
import {TimelineWindow} from 'matrix-js-sdk';
import {BasicDataUpdateService} from '../Update/basic-data-update.service';
import {DataModelService} from '../DataModel/data-model.service';
import {Currency} from '../DataModel/Utils/Currency';
import {TransactionType} from '../DataModel/Group/TransactionType';
import {ActivityType} from '../DataModel/Group/ActivityType';


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


describe('ObservableService_Update_DataModel', () => {

    const userId = '@id1:dsn.tm.kit.edu';

    let observableService: ObservableService;
    let updateService: BasicDataUpdateService;
    let dataModelService: DataModelService;

    // Mock client/clientService/LoggedInEmitter
    const mockedClient = jasmine.createSpyObj('MatrixClient',
        ['credentials', 'startClient', 'getUserId', 'getAccountDataFromServer', 'getUser', 'on', 'joinRoom']);
    const clientServiceSpy = jasmine.createSpyObj('MatrixClientService',
        ['getLoggedInEmitter', 'isPrepared', 'getClient', 'getRoomTypeClient', 'getLogoutEmitter']);
    const loggedInEmitter = jasmine.createSpyObj('EventEmitter', ['subscribe']);
    const logoutEmitter = jasmine.createSpyObj('EventEmitter', ['subscribe']);
    let clientEmitter;

    const mockedBalanceCalculatorService = jasmine.createSpyObj('BalanceCalculatorService', ['calculateBalances']);
    const mockedGreedyOptimisationService = jasmine.createSpyObj('GreedyOptimisationService', ['calculateOptimisation']);

    beforeEach(() => {
        clientEmitter = new EventEmitter();

        // Return the callback of the loggedInEmitter, when somebody subscribes to it
        loggedInEmitter.subscribe.and.callFake((callback: () => void) => {
            callback();
        });

        // Replace the returned loggedInEmitter with the mocked loggedInEmitter in the test
        clientServiceSpy.getLoggedInEmitter.and.returnValue(loggedInEmitter);
        clientServiceSpy.getLogoutEmitter.and.returnValue(logoutEmitter);
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
        // @ts-ignore
        ObservableService.prototype.paginateBackwardsUntilTheEnd = (window: TimelineWindow): Promise<void> => {
            return Promise.resolve();
        };
        observableService = new ObservableService(clientServiceSpy);
        console.log(observableService);

        TimelineWindow.prototype.load = () => {
            console.log('Replaced Method');
        };

        dataModelService = new DataModelService(mockedBalanceCalculatorService, mockedGreedyOptimisationService);
        updateService = new BasicDataUpdateService(observableService, dataModelService);

    });

    it('check if new group added', (done: DoneFn) => {

        const d1 = new Date('December 17, 1995 03:24:00');

        dataModelService.getUser().getGroupChangeEmitter().subscribe(() => {
            const newGroup = dataModelService.getUser().getGroup('room1');
            expect(newGroup).not.toEqual(null);
            expect(newGroup.name).toEqual('');
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

    it('add member to dataModel', (done: DoneFn) => {

        const d1 = new Date('December 17, 1995 03:24:00');

        dataModelService.getUser().createGroup('room1', 'name1', Currency.EUR);
        const group = dataModelService.getUser().getGroup('room1');
        group.getMemberChangeEmitter().subscribe(() => {
            const member = group.getGroupmember('c1');
            expect(member.contact.contactId).toEqual('c1');
            expect(member.contact.name).toEqual('Alice');
            expect(member.group.groupId).toEqual('room1');

            done();
        });

        clientEmitter.emit('RoomMember.membership',
            {
                getDate(): Date {
                    return d1;
                },
            },
            {
                userId: 'c1',
                name: 'Alice',
                roomId: 'room1',
                membership: 'join'
            },
            'invite'
        );
    });

    it('add member activity to dataModel', (done: DoneFn) => {

        const d1 = new Date('December 17, 1995 03:24:00');

        dataModelService.getUser().createGroup('room1', 'name1', Currency.EUR);
        const group = dataModelService.getUser().getGroup('room1');
        group.getActivityChangeEmitter().subscribe(() => {
            expect(group.activities.length).toEqual(1);
            expect(group.activities[0].activityType).toEqual(ActivityType.NEWCONTACTINGROUP);
            done();
        });

        clientEmitter.emit('RoomMember.membership',
            {
                getDate(): Date {
                    return d1;
                },
            },
            {
                userId: 'c1',
                name: 'Alice',
                roomId: 'room1',
                membership: 'join'
            },
            'invite'
        );
    });

    it('check room creation activity', (done: DoneFn) => {

        const d1 = new Date('December 17, 1995 03:24:00');
        const room = {roomId: 'room1'};

        dataModelService.getUser().createGroup('room1', 'name1', Currency.EUR);
        const group = dataModelService.getUser().getGroup('room1');
        group.getActivityChangeEmitter().subscribe(() => {
            expect(group.activities.length).toEqual(1);
            expect(group.activities[0].activityType).toEqual(ActivityType.GROUPCREATION);
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

    it('create payback in dataModel', (done: DoneFn) => {

        const d1 = new Date('December 17, 1995 03:24:00');
        const room = {roomId: 'room1'};

        dataModelService.getUser().createGroup('room1', 'name1', Currency.EUR);
        const group = dataModelService.getUser().getGroup('room1');
        group.getTransactionChangeEmitter().subscribe(() => {
            const transaction = group.getTransaction('t1');
            expect(transaction).not.toEqual(null);
            expect(transaction.name).toEqual('name_t1');
            expect(transaction.payer.contact.contactId).toEqual(userId);
            expect(transaction.creationDate).toEqual(d1);
            expect(transaction.sender.contact.contactId).toEqual(userId);
            expect(transaction.transactionType).toEqual(TransactionType.PAYBACK);
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


    it('check expense in dataModel', (done: DoneFn) => {

        const d1 = new Date('December 17, 1995 03:24:00');
        const room = {roomId: 'room1'};

        dataModelService.getUser().createGroup('room1', 'name1', Currency.EUR);
        const group = dataModelService.getUser().getGroup('room1');
        group.getTransactionChangeEmitter().subscribe(() => {
            const transaction = group.getTransaction('t2');
            expect(transaction).not.toEqual(null);
            expect(transaction.name).toEqual('name_t2');
            expect(transaction.payer.contact.contactId).toEqual(userId);
            expect(transaction.creationDate).toEqual(d1);
            expect(transaction.sender.contact.contactId).toEqual(userId);
            expect(transaction.transactionType).toEqual(TransactionType.EXPENSE);
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

    it('check expense activity in dataModel', (done: DoneFn) => {

        const d1 = new Date('December 17, 1995 03:24:00');
        const room = {roomId: 'room1'};

        dataModelService.getUser().createGroup('room1', 'name1', Currency.EUR);
        const group = dataModelService.getUser().getGroup('room1');
        group.getActivityChangeEmitter().subscribe(() => {
            expect(group.activities.length).toEqual(1);
            expect(group.activities[0].activityType).toEqual(ActivityType.NEWEXPENSE);
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

    it('create payback activity dataModel', (done: DoneFn) => {

        const d1 = new Date('December 17, 1995 03:24:00');
        const room = {roomId: 'room1'};
        // @ts-ignore
        const type = ObservableService.TRANSACTION_TYPE_PAYBACK;

        dataModelService.getUser().createGroup('room1', 'name1', Currency.EUR);
        const group = dataModelService.getUser().getGroup('room1');
        group.getActivityChangeEmitter().subscribe(() => {
            expect(group.activities.length).toEqual(1);
            expect(group.activities[0].activityType).toEqual(ActivityType.NEWPAYBACK);
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

});
