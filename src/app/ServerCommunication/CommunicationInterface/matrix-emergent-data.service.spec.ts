import { TestBed } from '@angular/core/testing';

import { MatrixEmergentDataService } from './matrix-emergent-data.service';
import {ServerResponse} from "../Response/ServerResponse";
import {SuccessfulResponse} from "../Response/SuccessfulResponse";

describe('MatrixEmergentDataServiceService', () => {
  let service: MatrixEmergentDataService;

  const mockedClient = jasmine.createSpyObj('MatrixClient',
    ['setRoomAccountData']);
  const clientServiceSpy = jasmine.createSpyObj('MatrixClientService',
    ['isPrepared', 'getClient']);

  beforeEach(() => {
    service = new MatrixEmergentDataService(clientServiceSpy);
    clientServiceSpy.getClient.and.returnValue(mockedClient);
    clientServiceSpy.isPrepared.and.returnValue(true);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set balances', async (done: DoneFn) => {
    mockedClient.setRoomAccountData.and.returnValue(Promise.resolve());

    service.setBalances('groupId', [100, 200, -300],
      ['@id1:dsn.tm.kit.edu', '@id2:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu'], 'lastTransactionId').then(
      (response: ServerResponse) => {
        expect(response instanceof SuccessfulResponse).toBe(true);
        expect(mockedClient.setRoomAccountData.calls.mostRecent().args).toEqual(['groupId', 'com.matrixpay.balances', {
          'balances': [100, 200, -300],
          'contacts': ['@id1:dsn.tm.kit.edu', '@id2:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu'],
          'last_transaction': 'lastTransactionId'
        }]);
        done();
      },
      () => {
        fail('should have been successful');
        done();
      });
  });

  it('should set recommendations', async (done: DoneFn) => {
    mockedClient.setRoomAccountData.and.returnValue(Promise.resolve());

    service.setRecommendations('groupId', [100, 200, 300],
      ['@id1:dsn.tm.kit.edu', '@id2:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu'], ['@id4:dsn.tm.kit.edu', '@id5:dsn.tm.kit.edu', '@id6:dsn.tm.kit.edu'], 'lastTransactionId').then(
      (response: ServerResponse) => {
        expect(response instanceof SuccessfulResponse).toBe(true);
        expect(mockedClient.setRoomAccountData.calls.mostRecent().args).toEqual(['groupId', 'com.matrixpay.recommendations', {
          'recipients': ['@id4:dsn.tm.kit.edu', '@id5:dsn.tm.kit.edu', '@id6:dsn.tm.kit.edu'],
          'payers': ['@id1:dsn.tm.kit.edu', '@id2:dsn.tm.kit.edu', '@id3:dsn.tm.kit.edu'],
          'amounts': [100, 200, 300],
          'last_transaction': 'lastTransactionId'
        }]);
        done();
      },
      () => {
        fail('should have been successful');
        done();
      });
  });
});
