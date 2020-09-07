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
import {AddMemberToGroupModalComponent} from "../ViewModel/add-user-to-group-modal/add-member-to-group-modal.component";
import {LeaveGroupModalComponent} from "../ViewModel/leave-group-modal/leave-group-modal.component";
import {SettingsComponent} from "../ViewModel/settings/settings.component";
import {NavigationMenuComponent} from "../ViewModel/navigation-menu/navigation-menu.component";
import {DialogProviderService} from "../ViewModel/dialog-provider.service";
import {BreakpointObserver} from "@angular/cdk/layout";


describe('ViewModel_ServerCommunication', () => {
    // Components
    let loginComponent: LoginComponent;
    let groupComponent: GroupSelectionComponent;
    let createGroupComponent: CreateGroupModalComponent;
    let addMemberComponent: AddMemberToGroupModalComponent;
    let leaveGroupComponent: LeaveGroupModalComponent;
    let settingsComponent: SettingsComponent;

    // Fixtures
    let loginFixture: ComponentFixture<LoginComponent>;
    let groupFixture: ComponentFixture<GroupSelectionComponent>;
    let createGroupFixture: ComponentFixture<CreateGroupModalComponent>;
    let addMemberFixture: ComponentFixture<AddMemberToGroupModalComponent>;
    let leaveGroupFixture: ComponentFixture<LeaveGroupModalComponent>;
    let settingsFixture: ComponentFixture<SettingsComponent>;

    // Modals
    let createGroupMatDialogRef: jasmine.SpyObj<MatDialogRef<CreateGroupModalComponent>>;
    let addMemberMatDialogRef: jasmine.SpyObj<MatDialogRef<AddMemberToGroupModalComponent>>;
    let leaveGroupMatDialogRef: jasmine.SpyObj<MatDialogRef<LeaveGroupModalComponent>>;

    // Mock Matrix-js-sdk methods and Data Model Service
    let classProviderSpy: jasmine.SpyObj<MatrixClassProviderService>;
    let dataModelService: jasmine.SpyObj<DataModelService>;

    // Mocked Client
    let mockedClient: jasmine.SpyObj<MatrixClient>;

    // Real Services
    let matrixClientService: MatrixClientService;
    let matrixEmergentDataService: MatrixEmergentDataService;
    let matrixBasicDataService: MatrixBasicDataService;

    beforeEach(async(() => {
        classProviderSpy = jasmine.createSpyObj('MatrixClassProviderService',
            ['createClient', 'findClientConfig']);
        dataModelService = jasmine.createSpyObj('DataModelService', ['getUser', 'getGroups', 'navItem$']);
        mockedClient = jasmine.createSpyObj('MatrixClient',
            ['setAccountData', 'getAccountDataFromServer', 'invite', 'getRoom', 'getUserId', 'sendEvent',
                'setRoomAccountData', 'createRoom', 'sendStateEvent', 'scrollback', 'leave', 'loginWithPassword', 'on',
                'removeListener', 'logout']);

        dataModelService.navItem$ = (new Subject()).asObservable();
        classProviderSpy.createClient.and.returnValue(Promise.resolve(mockedClient));
        const spyDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        // Components
        TestBed.configureTestingModule({
            declarations: [ LoginComponent, GroupSelectionComponent, SettingsComponent ],
            providers: [
                { provide: MatrixClassProviderService, useValue: classProviderSpy },
                { provide: DataModelService, useValue: dataModelService },
                { provide: MatDialog, useValue: MockDialog },
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

        // MatDialogRefs
        createGroupMatDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<CreateGroupModalComponent>>;
        addMemberMatDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AddMemberToGroupModalComponent>>;
        leaveGroupMatDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<LeaveGroupModalComponent>>;

        // Components
        loginFixture = TestBed.createComponent(LoginComponent);
        groupFixture = TestBed.createComponent(GroupSelectionComponent);
        createGroupFixture = TestBed.createComponent(CreateGroupModalComponent);
        addMemberFixture = TestBed.createComponent(AddMemberToGroupModalComponent);
        leaveGroupFixture = TestBed.createComponent(LeaveGroupModalComponent);
        settingsFixture = TestBed.createComponent(SettingsComponent);

        loginComponent = loginFixture.componentInstance;
        groupComponent = groupFixture.componentInstance;
        createGroupComponent = createGroupFixture.componentInstance;
        addMemberComponent = addMemberFixture.componentInstance;
        leaveGroupComponent = leaveGroupFixture.componentInstance;
        settingsComponent = settingsFixture.componentInstance;
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

    async function preparedLogin(): Promise<void> {
        // Mock the Client
        classProviderSpy.findClientConfig.and.callFake(() => {
            const config: DiscoveredClientConfig = {'m.homeserver': {'state': 'SUCCESS', 'error': '', 'base_url': 'https://host.com'}};
            return Promise.resolve(config);
        });
        mockedClient.loginWithPassword.and.returnValue(Promise.resolve());
        mockedClient.setAccountData.and.returnValue(null);
        mockedClient.getAccountDataFromServer.and.returnValue(Promise.resolve(null));
        // @ts-ignore
        mockedClient.on.and.callFake((event: string, func: any) => {func('PREPARED', null, null);});

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
        mockedClient.loginWithPassword.and.returnValue(Promise.reject({data: {errcode: 'M_FORBIDDEN', error: 'Invalid password'}}));

        // Login with these values
        loginComponent.matrixUrlControl.setValue('@username:host');
        loginComponent.passwordControl.setValue('password123');
        await loginComponent.login();

        // Expected
        expect(matrixClientService.isLoggedIn()).toBe(false);
        done();
    });

    // Test-case T30
    it('should create group', async (done: DoneFn) => {
        // Stub Values
        const c1 = new Contact('c1', 'Alice');
        const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
        const data = {
            groupName: 'name_g1',
            currency: Currency.USD
        };
        const g1 = new Group('g1', 'name_g1', Currency.USD);
        const g2 = new Group('g2', 'name_g2', Currency.USD);

        // Mocks
        // @ts-ignore
        mockedClient.createRoom.and.returnValue(Promise.resolve({room_id: 'room_id'}));
        mockedClient.sendStateEvent.and.returnValue(Promise.resolve());
        dataModelService.getUser.and.returnValue(stubValueUser);
        dataModelService.getGroups.and.returnValue([g1, g2]);

        // Spies
        // @ts-ignore
        const modalSpyOpen = spyOn(groupComponent.dialog, 'open').and.returnValue({afterClosed: () => of(data)});
        const basicSpy = spyOn(matrixBasicDataService, 'groupCreate').and.callThrough();

        // Calls
        await login();
        loginFixture.detectChanges();
        groupComponent.addGroup();
        createGroupComponent.data = data;
        createGroupComponent.ngOnInit();
        createGroupComponent.onSave();

        // Expectations
        expect(modalSpyOpen).toHaveBeenCalled();
        expect(createGroupMatDialogRef.close).toHaveBeenCalledWith(data);
        expect(basicSpy).toHaveBeenCalledWith('name_g1', Currency.USD.toString());
        const actualResponse = await basicSpy.calls.mostRecent().returnValue;
        expect(actualResponse instanceof SuccessfulResponse).toBe(true);
        expect(actualResponse.getValue()).toBe('room_id');

        done();
    });

    // Test-case T40
    it('should add group members', async (done: DoneFn) => {
        // Define Stub Values
        const c1 = new Contact('c1', 'Alice');
        const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
        const g1 = new Group('g1', 'name_g1', Currency.USD);
        const g2 = new Group('g2', 'name_g2', Currency.USD);
        const data = {
            group: g1,
            user: '@username:host'
        };

        // Spies
        const basicSpy = spyOn(matrixBasicDataService, 'groupAddMember').and.callThrough();
        // @ts-ignore
        const modalSpyOpen = spyOn(groupComponent.dialog, 'open').and.returnValue({afterClosed: () => of(data)});

        // Mocking
        mockedClient.invite.and.returnValue(Promise.resolve());
        dataModelService.getUser.and.returnValue(stubValueUser);
        dataModelService.getGroups.and.returnValue([g1, g2]);

        // login
        await preparedLogin();

        // Add member to group
        groupFixture.detectChanges();
        groupComponent.addMemberToGroup();
        addMemberComponent.data = data;
        addMemberComponent.ngOnInit();
        addMemberComponent.onSave();

        // Expected
        expect(modalSpyOpen).toHaveBeenCalled();
        expect(addMemberMatDialogRef.close).toHaveBeenCalledWith(data);
        expect(basicSpy).toHaveBeenCalledWith(data.group.groupId, data.user);
        const actualResponse = await basicSpy.calls.mostRecent().returnValue;
        expect(actualResponse instanceof SuccessfulResponse).toBe(true);

        done();
    });

    // Test-case T50
    it('should leave group', async (done: DoneFn) => {
        // Define Stub Values
        const c1 = new Contact('c1', 'Alice');
        const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
        const g1 = new Group('g1', 'name_g1', Currency.USD);
        const g2 = new Group('g2', 'name_g2', Currency.USD);
        const data = {
            group: g1
        };

        // Spies
        const basicSpy = spyOn(matrixBasicDataService, 'leaveGroup').and.callThrough();
        // @ts-ignore
        const modalSpyOpen = spyOn(groupComponent.dialog, 'open').and.returnValue({afterClosed: () => of(data)});

        // Mocking
        mockedClient.leave.and.returnValue(Promise.resolve());
        mockedClient.getRoom.and.callFake((groupId: string) => {
            return groupId === 'g1' ? true : undefined;
        });
        dataModelService.getUser.and.returnValue(stubValueUser);
        dataModelService.getGroups.and.returnValue([g1, g2]);

        // login
        await preparedLogin();

        // Leave group
        groupFixture.detectChanges();
        groupComponent.leaveGroup();
        leaveGroupComponent.data = data;
        leaveGroupComponent.ngOnInit();
        leaveGroupComponent.onSave();

        // Expected
        expect(modalSpyOpen).toHaveBeenCalled();
        expect(leaveGroupMatDialogRef.close).toHaveBeenCalledWith(data);
        expect(basicSpy).toHaveBeenCalledWith(data.group.groupId);
        const actualResponse = await basicSpy.calls.mostRecent().returnValue;
        console.log(actualResponse);
        expect(actualResponse instanceof SuccessfulResponse).toBe(true);

        done();
    });

    // T60: not implemented. ViewModel needs to check if balances are 0.

    it('should change currency', async (done: DoneFn) => {
        // Define Stub Values
        const stubValueUser = new User(null, Currency.USD, Language.GERMAN);

        // Spies
        const basicSpy = spyOn(matrixBasicDataService, 'userChangeDefaultCurrency').and.callThrough();

        // Mocking
        dataModelService.getUser.and.returnValue(stubValueUser);

        // Before test
        settingsFixture.detectChanges();
        expect(settingsComponent.selectedCurrency).toBe(stubValueUser.currency);

        // login
        await preparedLogin();

        // Add member to group
        settingsComponent.selectedCurrency = Currency.EUR;
        settingsFixture.detectChanges();
        settingsComponent.applySettings();

        // Expected
        expect(basicSpy).toHaveBeenCalledWith('EUR');
        const actualResponse = await basicSpy.calls.mostRecent().returnValue;
        console.log(actualResponse);
        expect(actualResponse instanceof SuccessfulResponse).toBe(true);

        done();
    });

    it('should logout', async (done: DoneFn) => {
        mockedClient.logout.and.returnValue(Promise.resolve());
        const dialogProvider = new DialogProviderService();
        const providerSpy = spyOn(dialogProvider, 'openErrorModal').and.callThrough();
        const clientSpy = spyOn(matrixClientService, 'logout').and.callThrough();
        const breakPointObserver = jasmine.createSpyObj('BreakPointObserver', ['observe']);
        breakPointObserver.observe.and.returnValue({pipe: () => {}});
        const comp = new NavigationMenuComponent(breakPointObserver, matrixClientService, null, dialogProvider);

        await login();
        comp.logout();

        expect(clientSpy).toHaveBeenCalled();
        const response = await clientSpy.calls.mostRecent().returnValue;
        expect(response instanceof SuccessfulResponse).toBe(true);
        expect(matrixClientService.isLoggedIn()).toBe(false);
        expect(providerSpy).not.toHaveBeenCalled();

        done();
    });
});
