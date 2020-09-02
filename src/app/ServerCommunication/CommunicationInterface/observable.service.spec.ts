import {ObservableService} from './observable.service';
import {Observable} from 'rxjs';
import {CurrencyType, UserType} from './parameterTypes';
import {EventEmitter} from 'events';

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


describe('ObservableService', () => {
  let service: ObservableService;

  const mockedClient = jasmine.createSpyObj('MatrixClient',
    ['credentials', 'startClient', 'getUserId', 'getAccountDataFromServer', 'getUser', 'on', 'joinRoom']);
  const clientServiceSpy = jasmine.createSpyObj('MatrixClientService',
    ['getLoggedInEmitter', 'isPrepared', 'getClient']);
  const loggedInEmitter = jasmine.createSpyObj('EventEmitter', ['subscribe']);
  let clientEmitter;
  
  beforeEach(() => {
    clientEmitter = new EventEmitter();
    
    loggedInEmitter.subscribe.and.callFake((callback: () => void) => {
      callback();
    });

    clientServiceSpy.getLoggedInEmitter.and.returnValue(loggedInEmitter);
    clientServiceSpy.isPrepared.and.returnValue(true);
    
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

    mockedClient.getUser.and.returnValue({
      displayName: "John Smith"
    });

    mockedClient.on.and.callFake((type: string, callback: any) => {
      clientEmitter.on(type, callback);
    });
    mockedClient.joinRoom.and.returnValue({});

    clientServiceSpy.getClient.and.returnValue(mockedClient);
    service = new ObservableService(clientServiceSpy);

  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get userObservable', () => {
    const actual: Observable<UserType> = service.getUserObservable();
    expect(actual).toBeDefined();
  });

  it('should join the room', () => {
    service.roomCallback(fakeRoom({
      '@id1:dsn.tm.kit.edu': {
        membership: 'invite'
      }
    }, 'USD'));
    expect(mockedClient.joinRoom).toHaveBeenCalled();
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
});
