import { TestBed } from '@angular/core/testing';

import { MatrixBasicDataService } from './matrix-basic-data.service';
import {SettingsService} from "../SettingsCommunication/settings.service";
import {GroupService} from "../GroupCommunication/group.service";
import {TransactionService} from "../GroupCommunication/transaction.service";
import {ServerResponse} from "../Response/ServerResponse";
import {SettingsError} from "../Response/ErrorTypes";
import {MatrixEmergentDataService} from "./matrix-emergent-data.service";

describe('MatrixBasicDataService', () => {
  let service: MatrixBasicDataService;

  const mockedClient = jasmine.createSpyObj('MatrixClient',
    ['setAccountData', 'invite', 'getRoom', 'getUserId', 'sendEvent']);
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
          ['com.matrixpay.currency', {'com.matrixpay.currency': 'EUR'}]);
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
          ['com.matrixpay.language', {'com.matrixpay.language': 'English'}]);
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
          ['com.matrixpay.currency', {'com.matrixpay.currency': 'EUR'}]);
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
          ['com.matrixpay.language', {'com.matrixpay.language': 'English'}]);
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
    mockedClient.getUserId.and.returnValue('@id3:dsn.tm.kit.edu');
    mockedClient.sendEvent.and.returnValue(Promise.resolve({event_id: 'new_transaction_id'}));

    await service.confirmPayback('groupId', 1).then(
      () => {
        done();
      },
      () => {
        fail('should return successful response');
        done();
      }
    );
  });
});
