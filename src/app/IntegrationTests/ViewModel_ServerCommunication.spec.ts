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
import {Contact} from "../DataModel/Group/Contact";
import {User} from "../DataModel/User/User";
import {Currency} from "../DataModel/Utils/Currency";
import {Language} from "../DataModel/Utils/Language";
import {Group} from "../DataModel/Group/Group";
import {GroupSelectionComponent} from "../ViewModel/group-selection/group-selection.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MockDialog, MockDialogCancel} from "../ViewModel/_mockServices/MockDialog";
import {CreateGroupModalComponent} from "../ViewModel/create-group-modal/create-group-modal.component";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {Observable, of, Subject} from "rxjs";
import {SuccessfulResponse} from "../ServerCommunication/Response/SuccessfulResponse";


describe('ViewModel_ServerCommunication', () => {
    let loginComponent: LoginComponent;
    let groupComponent: GroupSelectionComponent;
    let createGroupComponent: CreateGroupModalComponent;
    let loginFixture: ComponentFixture<LoginComponent>;
    let groupFixture: ComponentFixture<GroupSelectionComponent>;
    let createGroupFixture: ComponentFixture<CreateGroupModalComponent>;

    let matDialogRef: jasmine.SpyObj<MatDialogRef<CreateGroupModalComponent>>;

    // Mock Matrix-js-sdk methods and Data Model Service
    let classProviderSpy: jasmine.SpyObj<MatrixClassProviderService>;
    let dataModelService: jasmine.SpyObj<DataModelService>;

    // Real Services
    let matrixClientService: MatrixClientService;
    let matrixEmergentDataService: MatrixEmergentDataService;
    let matrixBasicDataService: MatrixBasicDataService;

    let mockedClient: jasmine.SpyObj<MatrixClient>;

    beforeEach(async(() => {
        classProviderSpy = jasmine.createSpyObj('MatrixClassProviderService',
            ['createClient', 'findClientConfig']);
        dataModelService = jasmine.createSpyObj('DataModelService', ['getUser', 'getGroups', 'navItem$']);
        mockedClient = jasmine.createSpyObj('MatrixClient',
            ['setAccountData', 'getAccountDataFromServer', 'invite', 'getRoom', 'getUserId', 'sendEvent',
                'setRoomAccountData', 'createRoom', 'sendStateEvent', 'scrollback', 'leave', 'loginWithPassword', 'on']);

        dataModelService.navItem$ = (new Subject()).asObservable();
        classProviderSpy.createClient.and.returnValue(Promise.resolve(mockedClient));
        const spyDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        // Components
        TestBed.configureTestingModule({
            declarations: [ LoginComponent, GroupSelectionComponent, CreateGroupModalComponent ],
            providers: [
                { provide: MatrixClassProviderService, useValue: classProviderSpy },
                { provide: MatDialog, useValue: MockDialog },
                { provide: DataModelService, useValue: dataModelService },
                { provide: MatDialogRef, useValue: spyDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: []},
                MatrixClientService,
                MatrixEmergentDataService,
                MatrixBasicDataService
            ],
            schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ]
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

        matDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<CreateGroupModalComponent>>;

        // Components
        loginFixture = TestBed.createComponent(LoginComponent);
        groupFixture = TestBed.createComponent(GroupSelectionComponent);
        createGroupFixture = TestBed.createComponent(CreateGroupModalComponent);
        loginComponent = loginFixture.componentInstance;
        groupComponent = groupFixture.componentInstance;
        createGroupComponent = createGroupFixture.componentInstance;
    }));

    async function login(): Promise<void> {
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
    }

    // Test-case T10
    it('should login', async (done: DoneFn) => {
        await login();

        // Expected
        expect(matrixClientService.isLoggedIn()).toBe(true);
        done();
    });

    // Test-case T20
    it('should not login with invalid credentials', async (done: DoneFn) => {
        // Mock the Client
        classProviderSpy.findClientConfig.and.callFake(() => {
            const config: DiscoveredClientConfig = {'m.homeserver': {'state': 'SUCCESS', 'error': '', 'base_url': 'https://host.com'}};
            return Promise.resolve(config);
        });
        mockedClient.loginWithPassword.and.returnValue(Promise.reject('M_FORBIDDEN: Invalid password'));

        // Login with these values
        loginComponent.matrixUrlControl.setValue('@username:host');
        loginComponent.passwordControl.setValue('password123');
        await loginComponent.login();

        // Expected
        expect(matrixClientService.isLoggedIn()).toBe(false);
        done();
    });

    // Test-case T30
    it('check create group confirm', async (done: DoneFn) => {
        await login();
        // @ts-ignore
        mockedClient.createRoom.and.returnValue(Promise.resolve({room_id: 'room_id'}));
        mockedClient.sendStateEvent.and.returnValue(Promise.resolve());

        const c1 = new Contact('c1', 'Alice');
        const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
        dataModelService.getUser.and.returnValue(stubValueUser);

        const data = {
            groupName: 'name_g1',
            currency: Currency.USD
        };
        const basicSpy = spyOn(matrixBasicDataService, 'groupCreate').and.callThrough();
        // @ts-ignore
        const modalSpyOpen = spyOn(groupComponent.dialog, 'open').and.returnValue({afterClosed: () => of(data)});

        const g1 = new Group('g1', 'name_g1', Currency.USD);
        const g2 = new Group('g2', 'name_g2', Currency.USD);

        dataModelService.getGroups.and.returnValue([g1, g2]);
        loginFixture.detectChanges();
        groupComponent.addGroup();

        expect(modalSpyOpen).toHaveBeenCalled();

        // const createModal = modalSpyOpen.calls.mostRecent().returnValue;

        createGroupComponent.data = data;
        createGroupComponent.ngOnInit();
        createGroupComponent.onSave();

        expect(matDialogRef.close).toHaveBeenCalledWith(data);
        expect(basicSpy).toHaveBeenCalledWith('name_g1', Currency.USD.toString());
        const actualResponse = await basicSpy.calls.mostRecent().returnValue;
        expect(actualResponse instanceof SuccessfulResponse).toBe(true);
        expect(actualResponse.getValue()).toBe('room_id');

        done();
    });
});
