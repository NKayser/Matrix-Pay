import { TestBed } from '@angular/core/testing';

import { ObservableService } from './observable.service';
import {Observable} from 'rxjs';
import {CurrencyType, UserType} from './parameterTypes';
import {EventEmitter} from 'events';

describe('ObservableService', () => {
  let service: ObservableService;

  const mockedClient = jasmine.createSpyObj('MatrixClient',
    ['credentials', 'startClient', 'getUserId', 'getAccountDataFromServer', 'getUser', 'on']);
  const clientServiceSpy = jasmine.createSpyObj('MatrixClientService',
    ['getLoggedInEmitter', 'isPrepared', 'getClient']);
  const loggedInEmitter = jasmine.createSpyObj('EventEmitter', ['subscribe']);
  const clientEmitter: EventEmitter = new EventEmitter();

  beforeEach(() => {

    loggedInEmitter.subscribe.and.callFake((callback: () => void) => {
      callback();
    });
    clientServiceSpy.getLoggedInEmitter.and.returnValue(loggedInEmitter);
    clientServiceSpy.getClient.and.returnValue(mockedClient);
    clientServiceSpy.isPrepared.and.returnValue(true);
    service = new ObservableService(clientServiceSpy);

    // Mock client
    mockedClient.credentials.and.returnValue({userId: '@id1:dsn.tm.kit.edu'});
    mockedClient.getUserId.and.returnValue('@id1:dsn.tm.kit.edu');
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
    mockedClient.getUser.and.returnValue('John Smith');
    mockedClient.on.and.callFake((type: string, callback: any) => {
      clientEmitter.on(type, callback);
    });
    // set initial settings
    // clientEmitter.emit('com.matrixpay.currency', {'currency': 'USD'});
    // clientEmitter.emit('com.matrixpay.language', {'language': 'English'});
  });

  /*it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get userObservable', () => {
    // Mock
    // mockedClient.abc.and.returnValue(Promise.resolve('value'));

    // Actual
    const actual: Observable<UserType> = service.getUserObservable();

    // Expected
    expect(actual).toBeDefined();
  });*/

  it('currency observable should emit changes', async (done: DoneFn) => {

    const currencyObservable: Observable<CurrencyType> = service.getSettingsCurrencyObservable();
    // const callbackCalled = false;
    // @ts-ignore
    const spy = spyOn(currencyObservable, 'next');

    /*currencyObservable.subscribe((currency: CurrencyType) => {
      expect(currency.currency).toBe('EUR');
      console.log('callback called');
      done();
    });*/

    // console.log(callbackCalled);

    clientEmitter.emit('accountData',
          {
            getType(): string {
              return 'com.matrixpay.currency';
            },
            getContent() {
              return {currency: 'EUR'};
            },
          });

    // expect(callbackCalled).toBe(true);
    expect(spy).toHaveBeenCalled();
    done();
  });
});
