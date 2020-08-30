import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {LoginComponent} from "../ViewModel/login/login.component";
import {MatrixClassProviderService} from "../ServerCommunication/CommunicationInterface/matrix-class-provider.service";
import {DataModelService} from "../DataModel/data-model.service";
import {MatrixClientService} from "../ServerCommunication/CommunicationInterface/matrix-client.service";
import {MatrixBasicDataService} from "../ServerCommunication/CommunicationInterface/matrix-basic-data.service";
import {DiscoveredClientConfig, MatrixClient} from "../../matrix";
import {GroupService} from "../ServerCommunication/GroupCommunication/group.service";
import {SettingsService} from "../ServerCommunication/SettingsCommunication/settings.service";
import {TransactionService} from "../ServerCommunication/GroupCommunication/transaction.service";
import {MatrixEmergentDataService} from "../ServerCommunication/CommunicationInterface/matrix-emergent-data.service";


describe('ViewModel_ServerCommunication', () => {
    let loginComponent: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    // Mock Matrix-js-sdk methods and Data Model Service
    let classProviderSpy: jasmine.SpyObj<MatrixClassProviderService> = jasmine.createSpyObj('MatrixClassProviderService',
        ['createClient', 'findClientConfig']);
    let dataModelService: jasmine.SpyObj<DataModelService> = jasmine.createSpyObj('DataModelService', ['getUser']);

    // Real Services
    let matrixClientService: MatrixClientService;
    let matrixEmergentDataService: MatrixEmergentDataService;
    let matrixBasicDataService: MatrixBasicDataService;

    let mockedClient: jasmine.SpyObj<MatrixClient> = jasmine.createSpyObj('MatrixClient',
        ['setAccountData', 'getAccountDataFromServer', 'invite', 'getRoom', 'getUserId', 'sendEvent',
            'setRoomAccountData', 'createRoom', 'sendStateEvent', 'scrollback', 'leave', 'loginWithPassword', 'on']);

    beforeEach(async(() => {
        // Create Spies for MatrixClassProviderService and DataModelService
        //classProviderSpy = jasmine.createSpyObj('MatrixClassProviderService',
        //    ['createClient', 'findClientConfig']);
        //dataModelService = jasmine.createSpyObj('DataModelService', ['getUser']);

        // Mocked Client
        //mockedClient = jasmine.createSpyObj('MatrixClient',
        //    ['setAccountData', 'getAccountDataFromServer', 'invite', 'getRoom', 'getUserId', 'sendEvent',
        //        'setRoomAccountData', 'createRoom', 'sendStateEvent', 'scrollback', 'leave', 'loginWithPassword', 'on']);
        classProviderSpy.createClient.and.returnValue(Promise.resolve(mockedClient));

        // Components
        TestBed.configureTestingModule({
            declarations: [ LoginComponent ],
            providers: [
                { provide: MatrixClassProviderService, useValue: classProviderSpy },
                MatrixClientService,
                MatrixEmergentDataService,
                MatrixBasicDataService,
                DataModelService
            ]
        }).compileComponents();

        // Set up real services
        matrixClientService = new MatrixClientService(classProviderSpy);
        matrixEmergentDataService = new MatrixEmergentDataService(matrixClientService);
        matrixBasicDataService = new MatrixBasicDataService(
            new GroupService(new TransactionService(matrixClientService), matrixClientService, matrixEmergentDataService),
            new SettingsService(matrixClientService));

        // Mock Services
        dataModelService = TestBed.inject(DataModelService) as jasmine.SpyObj<DataModelService>;
        classProviderSpy = TestBed.inject(MatrixClassProviderService) as jasmine.SpyObj<MatrixClassProviderService>;

        // Real Services
        matrixClientService = TestBed.inject(MatrixClientService);
        matrixEmergentDataService = TestBed.inject(MatrixEmergentDataService);
        matrixBasicDataService = TestBed.inject(MatrixBasicDataService);

        // Components
        fixture = TestBed.createComponent(LoginComponent);
        loginComponent = fixture.componentInstance;
    }));

    // Test-case T10
    it('should login', async (done: DoneFn) => {
        // Mock the Client
        classProviderSpy.findClientConfig.and.callFake(() => {
            const config: DiscoveredClientConfig = {'m.homeserver': {'state': 'SUCCESS', 'error': '', 'base_url': 'https://host.com'}};
            return Promise.resolve(config);
        });
        mockedClient.loginWithPassword.and.returnValue(Promise.resolve());
        mockedClient.setAccountData.and.returnValue(null);
        mockedClient.getAccountDataFromServer.and.returnValue(Promise.resolve(null));
        mockedClient.on.and.returnValue(null);

        // Login with these values
        loginComponent.matrixUrlControl.setValue('@username:host');
        loginComponent.passwordControl.setValue('password123');
        await loginComponent.login();

        // Expected
        expect(matrixClientService.isLoggedIn()).toBe(true);
        done();
    });
});
