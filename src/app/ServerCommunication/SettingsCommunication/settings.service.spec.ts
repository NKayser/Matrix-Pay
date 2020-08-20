import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';
import {MatrixClientService} from '../CommunicationInterface/matrix-client.service';
import {ServerResponse} from '../Response/ServerResponse';
import {SettingsError} from "../Response/ErrorTypes";

describe('SettingsServiceService', () => {
  let service: SettingsService;

  const mockedClient = jasmine.createSpyObj('MatrixClient',
    ['setAccountData']);
  const clientServiceSpy = jasmine.createSpyObj('MatrixClientService',
    ['getClient']);

  beforeEach(() => {
    service = new SettingsService(clientServiceSpy);
    clientServiceSpy.getClient.and.returnValue(mockedClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change currency', async (done: DoneFn) => {
    // Mock
    mockedClient.setAccountData.and.returnValue(Promise.resolve());

    // call function
    service.changeCurrency('EUR').then(
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
    service.changeLanguage('US').then(
      (response: ServerResponse) => {
        expect(response).toBeDefined();
        expect(response.wasSuccessful()).toBe(true);
        expect(clientServiceSpy.getClient).toHaveBeenCalled();
        expect(mockedClient.setAccountData.calls.mostRecent().args).toEqual(
          ['com.matrixpay.language', {'com.matrixpay.language': 'US'}]);
        done();
      },
      (err) => fail('should not throw error'));
  });

  it('changeCurrency should be unsuccessful when setAccount fails', async (done: DoneFn) => {
    // Mock
    mockedClient.setAccountData.and.returnValue(Promise.reject('reason'));

    // call function
    service.changeCurrency('EUR').then(
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
    service.changeLanguage('English').then(
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
});
