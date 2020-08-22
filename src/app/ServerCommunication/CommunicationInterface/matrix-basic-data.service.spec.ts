import { TestBed } from '@angular/core/testing';

import { MatrixBasicDataService } from './matrix-basic-data.service';
import {SettingsService} from "../SettingsCommunication/settings.service";
import {GroupService} from "../GroupCommunication/group.service";
import {TransactionService} from "../GroupCommunication/transaction.service";
import {ServerResponse} from "../Response/ServerResponse";
import {GroupError, SettingsError} from "../Response/ErrorTypes";
import {MatrixEmergentDataService} from "./matrix-emergent-data.service";
import {SuccessfulResponse} from "../Response/SuccessfulResponse";
import {UnsuccessfulResponse} from "../Response/UnsuccessfulResponse";

describe('MatrixBasicDataService', () => {
  let service: MatrixBasicDataService;

  const mockedClient = jasmine.createSpyObj('MatrixClient',
    ['setAccountData', 'invite', 'getRoom', 'getUserId', 'sendEvent', 'setRoomAccountData', 'createRoom', 'sendStateEvent', 'scrollback', 'leave']);
  const clientServiceSpy = jasmine.createSpyObj('MatrixClientService',
    ['isPrepared', 'getClient']);
  const settingsService = new SettingsService(clientServiceSpy);
  const transactionService = new TransactionService(clientServiceSpy);
  const emergentDataService = new MatrixEmergentDataService(clientServiceSpy);
  const groupService = new GroupService(transactionService, clientServiceSpy, emergentDataService);

  beforeEach(() => {
    service = new MatrixBasicDataService(groupService, settingsService);
    clientServiceSpy.getClient.and.returnValue(mockedClient);
    clientServiceSpy.isPrepared.and.returnValue(true);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change currency', async (done: DoneFn) => {
    // Mock
    mockedClient.setAccountData.and.returnValue(Promise.resolve());

    // call function
    service.userChangeDefaultCurrency('EUR').then(
      (response: ServerResponse) => {
        expect(response).toBeDefined();
        expect(response.wasSuccessful()).toBe(true);
        expect(clientServiceSpy.getClient).toHaveBeenCalled();
        expect(mockedClient.setAccountData.calls.mostRecent().args).toEqual(
          ['com.matrixpay.currency', {'currency': 'EUR'}]);
        done();
      },
      (err) => fail('should not throw error'));
  });

  it('should change language', async (done: DoneFn) => {
    // Mock
    mockedClient.setAccountData.and.returnValue(Promise.resolve());

    // call function
    service.userChangeLanguage('English').then(
      (response: ServerResponse) => {
        expect(response).toBeDefined();
        expect(response.wasSuccessful()).toBe(true);
        expect(clientServiceSpy.getClient).toHaveBeenCalled();
        expect(mockedClient.setAccountData.calls.mostRecent().args).toEqual(
          ['com.matrixpay.language', {'language': 'English'}]);
        done();
      },
      (err) => fail('should not throw error'));
  });

  it('changeCurrency should be unsuccessful when setAccount fails', async (done: DoneFn) => {
    // Mock
    mockedClient.setAccountData.and.returnValue(Promise.reject('reason'));

    // call function
    service.userChangeDefaultCurrency('EUR').then(
      (response: ServerResponse) => {
        expect(response).toBeDefined();
        expect(response.wasSuccessful()).toBe(false);
        expect(SettingsError[response.getError()]).toBe('Setter');
        expect(response.getMessage()).toBe('reason');
        expect(clientServiceSpy.getClient).toHaveBeenCalled();
        expect(mockedClient.setAccountData.calls.mostRecent().args).toEqual(
          ['com.matrixpay.currency', {'currency': 'EUR'}]);
        done();
      },
      (err) => fail('should not throw error'));
  });

  it('changeLanguage should be unsuccessful when setAccount fails', async (done: DoneFn) => {
    // Mock
    mockedClient.setAccountData.and.returnValue(Promise.reject('reason'));

    // call function
    service.userChangeLanguage('English').then(
      (response: ServerResponse) => {
        expect(response).toBeDefined();
        expect(response.wasSuccessful()).toBe(false);
        expect(SettingsError[response.getError()]).toBe('Setter');
        expect(response.getMessage()).toBe('reason');
        expect(clientServiceSpy.getClient).toHaveBeenCalled();
        expect(mockedClient.setAccountData.calls.mostRecent().args).toEqual(
          ['com.matrixpay.language', {'language': 'English'}]);
        done();
      },
      (err) => fail('should not throw error'));
  });

  it('should throw Error if Client not prepared', async (done: DoneFn) => {
    clientServiceSpy.getClient.and.returnValue(null);
    clientServiceSpy.isPrepared.and.returnValue(false);

    service.userChangeDefaultCurrency('currency').then(() => fail('should have thrown error'),
      (err) => expect(err.message).toBe('Client is not prepared'));

    service.userChangeLanguage('language').then(() => fail('should have thrown error'),
      (err) => expect(err.message).toBe('Client is not prepared'));

    service.confirmPayback(null, null).then(() => fail('should have thrown error'),
      (err) => expect(err.message).toBe('Client is not prepared'));

    service.groupAddMember(null, null).then(() => fail('should have thrown error'),
      (err) => expect(err.message).toBe('Client is not prepared'));

    service.fetchHistory(null).then(() => fail('should have thrown error'),
      (err) => expect(err.message).toBe('Client is not prepared'));

    service.leaveGroup(null).then(() => fail('should have thrown error'),
      (err) => expect(err.message).toBe('Client is not prepared'));

    done();
  });

  it('should addMember with valid input', async (done: DoneFn) => {
    mockedClient.invite.and.returnValue(Promise.resolve());

    service.groupAddMember('groupIdA', '@uxxxx:dsn.tm.kit.edu').then(
      (response: ServerResponse) => {
        expect(response).toBeDefined();
        expect(response.wasSuccessful()).toBe(true);
        done();
      },
      () => {
        fail('should be successful');
        done();
      }
    );
  });

  it('should not addMember with unrecognized groupId input', async (done: DoneFn) => {
    mockedClient.invite.and.returnValue(Promise.reject({data: {error: 'message', errcode: 'M_UNRECOGNIZED'}}));

    await service.groupAddMember('nonExistingGroup', '@uxxxx:dsn.tm.kit.edu').then(
      () => {
        fail('should throw error');
        done();
      },
      (err) => {
        expect(err.message).toContain('GroupId invalid');
        done();
      }
    );
  });

  it('should not addMember with unknown groupId input', async (done: DoneFn) => {
    mockedClient.invite.and.returnValue(Promise.reject({data: {error: 'message', errcode: 'M_UNKNOWN'}}));

    await service.groupAddMember('nonExistingGroup', '@uxxxx:dsn.tm.kit.edu').then(
      () => {
        fail('should throw error');
        done();
      },
      (err) => {
        expect(err.message).toContain('GroupId invalid');
        done();
      }
    );
  });

  it('should not addMember with invalid userId input', async (done: DoneFn) => {
    mockedClient.invite.and.returnValue(Promise.reject({data: {error: 'message', errcode: 'M_INVALID_PARAM'}}));

    await service.groupAddMember('group', 'invalid').then(
      () => {
        fail('should throw error');
        done();
      },
      (err) => {
        expect(err.message).toContain('UserId invalid');
        done();
      }
    );
  });

  it('should not addMember with invalid input', async (done: DoneFn) => {
    mockedClient.invite.and.returnValue(Promise.reject({data: {error: 'message', errcode: 'SOME_CODE'}}));

    await service.groupAddMember('group', 'invalid').then(
      () => {
        fail('should throw error');
        done();
      },
      (err) => {
        expect(err.message).toContain('unknown error');
        done();
      }
    );
  });

  it('should confirm recommendation with valid input', async (done: DoneFn) => {
    // Mock
    const accountDataEvent = jasmine.createSpyObj('accountDataEvent', ['getOriginalContent']);
    accountDataEvent.getOriginalContent.and.returnValue(
      {
        recipients: ['@id1:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu'],
        payers: ['@id2:dsn.tm.kit.edu', '@id4:dsn.tm.kit.edu'],
        amounts: [100, 200],
        last_transaction: 'lastId'
      });
    mockedClient.getRoom.and.returnValue({
        roomId: 'room_id_A',
        memberIds: ['@id1:dsn.tm.kit.edu', '@id2:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu', '@id4:dsn.tm.kit.edu'],
        accountData: {
          recommendations: accountDataEvent
        }
      }
    );
    mockedClient.getUserId.and.returnValue('@id4:dsn.tm.kit.edu');
    mockedClient.sendEvent.and.returnValue(Promise.resolve({event_id: 'new_transaction_id'}));
    mockedClient.setRoomAccountData.and.returnValue(Promise.resolve());

    await service.confirmPayback('groupId', 1).then(
      (response: ServerResponse) => {
        expect(response instanceof SuccessfulResponse).toBe(true);
        expect(response.getValue()).toBe('new_transaction_id');
        expect(mockedClient.sendEvent).toHaveBeenCalled();
        done();
      },
      () => {
        fail('should return successful response');
        done();
      }
    );
  });

  it('confirmPayback should throw Error if room not found', async (done: DoneFn) => {
    // Mock
    mockedClient.getRoom.and.returnValue(null);

    await service.confirmPayback('groupId', 1).then(
      () => {
        fail('confirmPayback should fail');
      },
      (err) => {
        expect(err.message).toContain('room not found');
        done();
      }
    );
  });

  it('confirmPayback should throw Error if no recommendations saved', async (done: DoneFn) => {
    // Mock
    mockedClient.getRoom.and.returnValue({
        roomId: 'room_id_A',
        memberIds: ['@id1:dsn.tm.kit.edu', '@id2:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu', '@id4:dsn.tm.kit.edu'],
        accountData: {}
      }
    );

    await service.confirmPayback('groupId', 1).then(
      () => {
        fail('confirmPayback should fail');
      },
      (err) => {
        expect(err.message).toContain('no recommendations have been saved yet');
        done();
      }
    );
  });

  it('confirmPayback should throw Error if recommendation id invalid', async (done: DoneFn) => {
    // Mock
    const accountDataEvent = jasmine.createSpyObj('accountDataEvent', ['getOriginalContent']);
    accountDataEvent.getOriginalContent.and.returnValue(
      {
        recipients: ['@id1:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu'],
        payers: ['@id2:dsn.tm.kit.edu', '@id4:dsn.tm.kit.edu'],
        amounts: [100, 200],
        last_transaction: 'lastId'
      });
    mockedClient.getRoom.and.returnValue({
        roomId: 'room_id_A',
        memberIds: ['@id1:dsn.tm.kit.edu', '@id2:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu', '@id4:dsn.tm.kit.edu'],
        accountData: {
          recommendations: accountDataEvent
        }
      }
    );

    const invalidIds: number[] = [-1, -0.5, 0.5, 2];

    for (const invalidId of invalidIds) {
      await service.confirmPayback('groupId', invalidId).then(
        () => {
          fail();
          done();
        },
        (err) => {
          expect(err.message).toContain('invalid recommendation id');
          done();
        }
      );
    }
  });

  it('confirmPayback should throw Error if user is not payer', async (done: DoneFn) => {
    // Mock
    const accountDataEvent = jasmine.createSpyObj('accountDataEvent', ['getOriginalContent']);
    accountDataEvent.getOriginalContent.and.returnValue(
      {
        recipients: ['@id1:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu'],
        payers: ['@id2:dsn.tm.kit.edu', '@id4:dsn.tm.kit.edu'],
        amounts: [100, 200],
        last_transaction: 'lastId'
      });
    mockedClient.getRoom.and.returnValue({
        roomId: 'room_id_A',
        memberIds: ['@id1:dsn.tm.kit.edu', '@id2:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu', '@id4:dsn.tm.kit.edu'],
        accountData: {
          recommendations: accountDataEvent
        }
      }
    );
    mockedClient.getUserId.and.returnValue('@id1:dsn.tm.kit.edu');

    await service.confirmPayback('groupId', 1).then(
      () => {
        fail('confirmPayback should fail');
      },
      (err) => {
        expect(err.message).toContain('user must be payer of the recommendation');
        done();
      }
    );
  });

  it('createGroup should be successful with valid input', async (done: DoneFn) => {
    // Mock
    mockedClient.createRoom.and.returnValue(Promise.resolve({'room_id': 'roomId'}));
    mockedClient.sendStateEvent.and.returnValue(Promise.resolve());

    await service.groupCreate('groupId', 'EUR').then(
      (response: ServerResponse) => {
        expect(response instanceof SuccessfulResponse).toBe(true);
        expect(response.getValue()).toBe('roomId');
        done();
      },
      () => {
        fail('should have succeeded');
        done();
      }
    );
  });

  it('createGroup should be unsuccessful with invalid name', async (done: DoneFn) => {
    // Mock
    mockedClient.createRoom.and.returnValue(Promise.reject({'data': {'error': 'message', 'errcode': 'M_UNKNOWN'}}));

    await service.groupCreate('groupId', 'EUR').then(
      (response: ServerResponse) => {
        expect(response instanceof UnsuccessfulResponse).toBe(true);
        expect(GroupError[response.getError()]).toBe('InvalidName');
        expect(response.getMessage()).toContain('message');
        done();
      },
      (err) => {
        fail('should be Unsuccessful, not throw error ' + err.message);
        done();
      }
    );
  });

  it('createGroup should be unsuccessful when room in use', async (done: DoneFn) => {
    // Mock
    mockedClient.createRoom.and.returnValue(Promise.reject({'data': {'error': 'message', 'errcode': 'M_ROOM_IN_USE'}}));

    await service.groupCreate('groupId', 'EUR').then(
      (response: ServerResponse) => {
        expect(response instanceof UnsuccessfulResponse).toBe(true);
        expect(GroupError[response.getError()]).toBe('InUse');
        expect(response.getMessage()).toContain('message');
        done();
      },
      (err) => {
        fail('should be Unsuccessful, not throw error ' + err.message);
        done();
      }
    );
  });

  it('createGroup should be unsuccessful with invalid input', async (done: DoneFn) => {
    // Mock
    mockedClient.createRoom.and.returnValue(Promise.reject({'data': {'error': 'message', 'errcode': 'foo'}}));

    await service.groupCreate('groupId', 'EUR').then(
      (response: ServerResponse) => {
        expect(response instanceof UnsuccessfulResponse).toBe(true);
        expect(GroupError[response.getError()]).toBe('Unknown');
        expect(response.getMessage()).toContain('message');
        done();
      },
      (err) => {
        fail('should be Unsuccessful, not throw error ' + err.message);
        done();
      }
    );
  });

  it('createGroup should be unsuccessful if setting currency fails', async (done: DoneFn) => {
    // Mock
    mockedClient.createRoom.and.returnValue(Promise.resolve({'room_id': 'roomId'}));
    mockedClient.sendStateEvent.and.returnValue(Promise.reject('error'));

    await service.groupCreate('groupId', 'EUR').then(
      (response: ServerResponse) => {
        expect(response instanceof UnsuccessfulResponse).toBe(true);
        expect(GroupError[response.getError()]).toBe('SetCurrency');
        expect(response.getMessage()).toContain('error');
        done();
      },
      (err) => {
        fail('should be Unsuccessful, not throw error ' + err.message);
        done();
      }
    );
  });

  it('should fetch History', async (done: DoneFn) => {
    mockedClient.scrollback.and.returnValue(Promise.resolve());

    await service.fetchHistory('groupId').then(
      (response: ServerResponse) => {
        expect(response instanceof SuccessfulResponse).toBe(true);
        expect(mockedClient.scrollback).toHaveBeenCalled();
        done();
      },
      () => {
        fail();
        done();
      }
    );
  });

  it('should leave group', async (done: DoneFn) => {
    mockedClient.leave.and.returnValue(Promise.resolve());
    mockedClient.getRoom.and.returnValue({
        roomId: 'room_id_A',
        memberIds: ['@id1:dsn.tm.kit.edu', '@id2:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu', '@id4:dsn.tm.kit.edu'],
        accountData: {}
      }
    );

    await service.leaveGroup('groupId').then(
      (response: ServerResponse) => {
        expect(response instanceof SuccessfulResponse);
        expect(mockedClient.leave).toHaveBeenCalled();
        done();
      },
      () => {
        fail('should have been successful');
        done();
      }
    );
  });

  it('leaveGroup should be unsuccessful if room not found', async (done: DoneFn) => {
    mockedClient.getRoom.and.returnValue(undefined);

    await service.leaveGroup('groupId').then(
      (response: ServerResponse) => {
        expect(response instanceof UnsuccessfulResponse);
        expect(mockedClient.leave).not.toHaveBeenCalled();
        expect(GroupError[response.getError()]).toBe('RoomNotFound');
        done();
      },
      () => {
        fail('should have been successful');
        done();
      }
    );
  });

  it('leaveGroup should be unsuccessful if room not found 2', async (done: DoneFn) => {
    mockedClient.getRoom.and.returnValue({
        roomId: 'room_id_A',
        memberIds: ['@id1:dsn.tm.kit.edu', '@id2:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu', '@id4:dsn.tm.kit.edu'],
        accountData: {}
      }
    );
    mockedClient.leave.and.returnValue(Promise.reject({'data': {'error': 'message', 'errcode': 'M_UNKNOWN'}}));

    await service.leaveGroup('groupId').then(
      (response: ServerResponse) => {
        expect(response instanceof UnsuccessfulResponse);
        expect(mockedClient.leave).toHaveBeenCalled();
        expect(GroupError[response.getError()]).toBe('RoomNotFound');
        done();
      },
      () => {
        fail('should have been successful');
        done();
      }
    );
  });

  it('leaveGroup should be unsuccessful if unknown error', async (done: DoneFn) => {
    mockedClient.getRoom.and.returnValue({
        roomId: 'room_id_A',
        memberIds: ['@id1:dsn.tm.kit.edu', '@id2:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu', '@id4:dsn.tm.kit.edu'],
        accountData: {}
      }
    );
    mockedClient.leave.and.returnValue(Promise.reject({'data': {'error': 'message', 'errcode': 'abc'}}));

    await service.leaveGroup('groupId').then(
      (response: ServerResponse) => {
        expect(response instanceof UnsuccessfulResponse);
        expect(mockedClient.leave).toHaveBeenCalled();
        expect(GroupError[response.getError()]).toBe('Unknown');
        done();
      },
      () => {
        fail('should have been successful');
        done();
      }
    );
  });

  it('should create transaction successfully with valid input', async (done: DoneFn) => {
    // Mock
    mockedClient.sendEvent.and.returnValue(Promise.resolve({'event_id': 'transactionId'}));

    await service.createTransaction('groupId', 'Description', '@id1:dsn.tm.kit.edu',
      ['@id2:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu'], [100, 200], false).then(
      (response: ServerResponse) => {
        expect(response instanceof SuccessfulResponse).toBe(true);
        expect(response.getValue()).toBe('transactionId');
        expect(mockedClient.sendEvent.calls.mostRecent().args).toEqual(['groupId', 'com.matrixpay.expense', {
          'name': 'Description',
          'payer': '@id1:dsn.tm.kit.edu',
          'recipients': ['@id2:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu'],
          'amounts': [100, 200]
        }, '']);
        done();
      },
      () => {
        fail('should be unsuccessful, not throw error');
        done();
      });
  });

  it('createTransaction should be unsuccessful if sendEvent fails', async (done: DoneFn) => {
    // Mock
    mockedClient.sendEvent.and.returnValue(Promise.reject('message'));

    await service.createTransaction('groupId', 'Description', '@id1:dsn.tm.kit.edu',
      ['@id2:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu'], [100, 200], false).then(
      (response: ServerResponse) => {
        expect(response instanceof UnsuccessfulResponse).toBe(true);
        expect(response.getMessage()).toContain('message');
        expect(GroupError[response.getError()]).toBe('SendEvent');
        done();
      },
      () => {
        fail('should be unsuccessful, not throw error');
        done();
      });
  });

  // modify transaction
});
