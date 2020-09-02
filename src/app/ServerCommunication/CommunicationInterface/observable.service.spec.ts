import {fakeAsync, flushMicrotasks, tick} from '@angular/core/testing';

import {ObservableService} from './observable.service';
import {Observable} from 'rxjs';
import {CurrencyType, UserType} from './parameterTypes';
import {EventEmitter} from 'events';
// import {EventTimeline} from "matrix-js-sdk";

describe('ObservableService', () => {
  let service: ObservableService;

  const mockedClient = jasmine.createSpyObj('MatrixClient',
    ['credentials', 'startClient', 'getUserId', 'getAccountDataFromServer', 'getUser', 'on', 'joinRoom']);
  const clientServiceSpy = jasmine.createSpyObj('MatrixClientService',
    ['getLoggedInEmitter', 'isPrepared', 'getClient']);
  const loggedInEmitter = jasmine.createSpyObj('EventEmitter', ['subscribe']);
  const clientEmitter: EventEmitter = new EventEmitter();
  const timelineWindow = jasmine.createSpyObj('TimelineWindow', ['load']);

  function fakeRoom(members: object, currency: string): object {
    return {
      getLiveTimeline(): object {
        return {
          getState(direction: string): object {
            return {
              members,
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
          },
          getTimelineSet(): object { return {}; }
        };
      }
    };
  }

  beforeEach(() => {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
    mockedClient.joinRoom.and.returnValue({});
    // set initial settings
    // clientEmitter.emit('com.matrixpay.currency', {'currency': 'USD'});
    // clientEmitter.emit('com.matrixpay.language', {'language': 'English'});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get userObservable', () => {
    // Mock
    // mockedClient.abc.and.returnValue(Promise.resolve('value'));

    // Actual
    const actual: Observable<UserType> = service.getUserObservable();

    // Expected
    expect(actual).toBeDefined();
  });

  it('currency observable should emit changes', (done: DoneFn) => {

    const currencyObservable: Observable<CurrencyType> = service.getSettingsCurrencyObservable();
    // const callbackCalled = false;
    // const spy = spyOn(currencyObservable, 'next');

    currencyObservable.subscribe((currency: CurrencyType) => {
      console.log('callback called');
      expect(currency.currency).toBe('EUR');
      done();
    });

    // console.log(callbackCalled);

    // workaround: service.accountDataCallback(...)
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

    // flushMicrotasks();
    // expect(callbackCalled).toBe(true);
    // expect(spy).toHaveBeenCalled();
    // expect(spy).toHaveBeenCalledWith({currency: 'com.matrixpay.currency'});
    // done();
  });

  it('should join the room', () => {
    service.roomCallback(fakeRoom({
      '@id1:dsn.tm.kit.edu': {
        membership: 'invite'
      }
    }, 'USD'));
    expect(mockedClient.joinRoom).toHaveBeenCalled();
  });

  /*it('should paginate', () => {
    service.roomCallback(fakeRoom({
      '@id1:dsn.tm.kit.edu': {
        membership: 'join'
      }
    }, 'USD'));
    expect(timelineWindow.load).toHaveBeenCalled();
  });*/
});
