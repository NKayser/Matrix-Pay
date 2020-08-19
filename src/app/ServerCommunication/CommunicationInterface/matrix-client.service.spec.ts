import { TestBed } from '@angular/core/testing';

import { MatrixClientService } from './matrix-client.service';
import {MatrixClassProviderService} from "../ServerUtils/matrix-class-provider.service";
import {SuccessfulResponse} from "../Response/SuccessfulResponse";

describe('MatrixClientServiceService', () => {
  let service: MatrixClientService;
  const mockedClient = jasmine.createSpyObj('MatrixClient', ['loginWithPassword', 'setAccountData', 'getAccountData']);
  const classProviderSpy = jasmine.createSpyObj('MatrixClassProviderService', ['createClient', 'findClientConfig']);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrixClientService);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with valid input', async (done: DoneFn) => {
    classProviderSpy.createClient.and.returnValue(mockedClient);
    classProviderSpy.findClientConfig.and.returnValue({});
    mockedClient.loginWithPassword.and.returnValue(Promise.resolve());
    mockedClient.setAccountData.and.returnValue();
    mockedClient.getAccountData.and.returnValue(null);

    const response = await service.login('@uxxxx:dsn.tm.kit.edu', 'password');

    expect(classProviderSpy.createClient).toHaveBeenCalled();
    expect(response).toBeDefined();
    expect(response.wasSuccessful()).toBe(true);
  });
});
