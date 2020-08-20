import { TestBed } from '@angular/core/testing';

import { MatrixClientService } from './matrix-client.service';
import {MatrixClassProviderService} from "../ServerUtils/matrix-class-provider.service";
import {SuccessfulResponse} from "../Response/SuccessfulResponse";
import {ServerResponse} from "../Response/ServerResponse";
import {UnsuccessfulResponse} from "../Response/UnsuccessfulResponse";
import {ClientError} from "../Response/ErrorTypes";
import {EventEmitter} from "@angular/core";

describe('MatrixClientServiceService', () => {
  let service: MatrixClientService;
  const mockedClient = jasmine.createSpyObj('MatrixClient',
    ['loginWithPassword', 'setAccountData', 'getAccountDataFromServer', 'on', 'logout']);
  const classProviderSpy = jasmine.createSpyObj('MatrixClassProviderService',
    ['createClient', 'findClientConfig']);

  beforeEach(() => {
    //TestBed.configureTestingModule({});
    //service = TestBed.inject(MatrixClientService);
    service = new MatrixClientService(classProviderSpy);
    classProviderSpy.createClient.and.returnValue(mockedClient);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with valid input', async (done: DoneFn) => {
    // Set up Mocks
    classProviderSpy.findClientConfig.and.returnValue(
      {'m.homeserver': {'state': 'SUCCESS', 'base_url': 'https://matrix.dsn.scc.kit.edu'}});
    mockedClient.loginWithPassword.and.returnValue(Promise.resolve());
    mockedClient.setAccountData.and.returnValue();
    mockedClient.getAccountDataFromServer.and.returnValue(Promise.resolve(null));
    mockedClient.on.and.callFake((key: string, listener: (state, prevState, res) => void) => {return;});

    // Actual
    let emitted: boolean = false;
    service.getLoggedInEmitter().subscribe(() => emitted = true);
    const response = await service.login('@uxxxx:dsn.tm.kit.edu', 'password');

    // Expected
    expect(classProviderSpy.createClient).toHaveBeenCalled();
    expect(emitted).toBe(true);
    expect(response).toBeDefined();
    expect(response.wasSuccessful()).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    done();
  });

  it('should throw Error when already logged in', async (done: DoneFn) => {
    // Set up Mocks
    classProviderSpy.findClientConfig.and.returnValue(
      {'m.homeserver': {'state': 'SUCCESS', 'base_url': 'https://matrix.dsn.scc.kit.edu'}});
    mockedClient.loginWithPassword.and.returnValue(Promise.resolve());
    mockedClient.setAccountData.and.returnValue();
    mockedClient.getAccountDataFromServer.and.returnValue(Promise.resolve(null));
    mockedClient.on.and.callFake((key: string, listener: (state, prevState, res) => void) => {return;});
    await service.login('@uxxxx:dsn.tm.kit.edu', 'password');

    // Log in a second time, expect error
    service.login('@uxxxx:dsn.tm.kit.edu', 'password').then(
      () => fail('expected error, not Successful Login or Exception'),
      (error) => expect(error.message).toContain('already logged in')
    );

    // Expected
    expect(service.isLoggedIn()).toBe(true);
    done();
  });

  it('should throw Error on login with wrong input format', async (done: DoneFn) => {
    // Setup
    const invalidUserIdExamples: string[] = ['', '@', ':', '@abc:', '@abc:def:', '@a:b:c'];

    // Log in with wrong format
    for (const userId of invalidUserIdExamples) {
      await service.login(userId, 'password').then(
        () => fail('expected error, not Successful Login or Exception'),
        (error) => expect(error.message).toContain('wrong user id format')
      );
    }

    // Expected
    expect(service.isLoggedIn()).toBe(false);
    expect(classProviderSpy.createClient).not.toHaveBeenCalled();
    done();
  });

  it('login should be Unsuccessful when homeserver address cannot be found (AutoDiscovery)',
    async (done: DoneFn) => {
    // Set up Mocks
    classProviderSpy.findClientConfig.and.returnValue(
      {'m.homeserver': {'state': 'ERROR', 'error': 'some message', 'base_url': null}});

    // Login
    await service.login('@uxxxx:not.a.valid.url', 'password').then(
      (response: ServerResponse) => {
        expect(response instanceof UnsuccessfulResponse).toBe(true);
        expect(response.wasSuccessful()).toBe(false);
        expect(ClientError[response.getError()]).toBe('Autodiscovery');
        expect(response.getMessage()).toBe('some message');
      },
      () => fail('failed AutoDiscovery should return Unsuccessful, not reject')
    );

    // Expected
    expect(service.isLoggedIn()).toBe(false);
    done();
  });

  it('login should be unsuccessful with invalid password', async (done: DoneFn) => {
    // Setup
    classProviderSpy.findClientConfig.and.returnValue(
      {'m.homeserver': {'state': 'SUCCESS', 'base_url': 'https://matrix.dsn.scc.kit.edu'}});
    mockedClient.loginWithPassword.and.returnValue(Promise.reject('M_FORBIDDEN: Invalid password'));
    const invalidPasswordExamples: string[] = ['', 'invalid'];

    // Log in with wrong format
    for (const password of invalidPasswordExamples) {
      await service.login('@uxxxx:dsn.tm.kit.edu', password).then(
        (response: ServerResponse) => {
          console.log(response);
          expect(response instanceof UnsuccessfulResponse).toBe(true);
          expect(response.wasSuccessful()).toBe(false);
          expect(ClientError[response.getError()]).toBe('InvalidPassword');
          expect(response.getMessage()).toBe('M_FORBIDDEN: Invalid password');
        },
        () => fail('Login with invalid password should return Unsuccessful, not reject')
      );
    }

    // Expected
    expect(service.isLoggedIn()).toBe(false);
    done();
  });

  it('should return an EventEmitter', () => {
    expect(service.getLoggedInEmitter() instanceof EventEmitter).toBe(true);
  });

  it('should logout even if already logged out', async (done: DoneFn) => {
    // Mock
    mockedClient.logout.and.returnValue();

    expect(service.isPrepared()).toBe(false);
    expect(service.isLoggedIn()).toBe(false);

    service.logout().then(
      (response: ServerResponse) => {
        expect(response).toBeDefined();
        expect(response instanceof SuccessfulResponse).toBe(true);
        expect(response.wasSuccessful()).toBe(true);
      },
      () => fail('logout failed')
    );

    expect(service.isPrepared()).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
    done();
  });

  it('should logout when previously logged in', async (done: DoneFn) => {
    // Mock
    mockedClient.logout.and.returnValue();

    // Set up Mocks
    classProviderSpy.findClientConfig.and.returnValue(
      {'m.homeserver': {'state': 'SUCCESS', 'base_url': 'https://matrix.dsn.scc.kit.edu'}});
    mockedClient.loginWithPassword.and.returnValue(Promise.resolve());
    mockedClient.setAccountData.and.returnValue();
    mockedClient.getAccountDataFromServer.and.returnValue(Promise.resolve(null));
    mockedClient.on.and.callFake((key: string, listener: (state, prevState, res) => void) => {return;});

    // Login
    const response = await service.login('@uxxxx:dsn.tm.kit.edu', 'password');
    expect(service.isLoggedIn()).toBe(true);

    // Actual
    await service.logout().then(
      (response: ServerResponse) => {
        expect(response).toBeDefined();
        expect(response instanceof SuccessfulResponse).toBe(true);
        expect(response.wasSuccessful()).toBe(true);
      },
      () => fail('logout failed'));

    // Expected
    expect(service.isLoggedIn()).toBe(false);
    expect(service.isPrepared()).toBe(false);
    done();
  });
});
