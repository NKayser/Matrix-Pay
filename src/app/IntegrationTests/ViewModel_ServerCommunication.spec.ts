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
import {Currency, currencyMap, matrixCurrencyMap} from '../DataModel/Utils/Currency';
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
import {log} from "util";
import {ServerResponse} from "../ServerCommunication/Response/ServerResponse";
import {Groupmember} from "../DataModel/Group/Groupmember";
import {GroupTransactionComponent} from "../ViewModel/group-transaction/group-transaction.component";
import {PaymentModalComponent} from "../ViewModel/payment-modal/payment-modal.component";
import {ConfirmPaybackModalComponent} from "../ViewModel/confirm-payback-modal/confirm-payback-modal.component";
import {Recommendation} from "../DataModel/Group/Recommendation";
import {AtomarChange} from "../DataModel/Group/AtomarChange";
import {GroupBalanceComponent} from "../ViewModel/group-balance/group-balance.component";
import {EventEmitter} from "events";
import {UnsuccessfulResponse} from "../ServerCommunication/Response/UnsuccessfulResponse";
import {ClientError} from "../ServerCommunication/Response/ErrorTypes";
import {ReversePipePipe} from '../ViewModel/reverse-pipe.pipe';


describe('ViewModel_ServerCommunication', () => {
    // Components
    let loginComponent: LoginComponent;
    let groupComponent: GroupSelectionComponent;
    let createGroupComponent: CreateGroupModalComponent;
    let groupTransactionComponent: GroupTransactionComponent;
    let paymentModal: PaymentModalComponent;
    let addMemberComponent: AddMemberToGroupModalComponent;
    let leaveGroupComponent: LeaveGroupModalComponent;
    let settingsComponent: SettingsComponent;
    let groupBalanceComponent: GroupBalanceComponent;
    let confirmPaybackComponent: ConfirmPaybackModalComponent;

    // Fixtures
    let loginFixture: ComponentFixture<LoginComponent>;
    let groupFixture: ComponentFixture<GroupSelectionComponent>;
    let createGroupFixture: ComponentFixture<CreateGroupModalComponent>;
    let groupTransactionFixture: ComponentFixture<GroupTransactionComponent>;
    let paymentModalFixture: ComponentFixture<PaymentModalComponent>;
    let addMemberFixture: ComponentFixture<AddMemberToGroupModalComponent>;
    let leaveGroupFixture: ComponentFixture<LeaveGroupModalComponent>;
    let settingsFixture: ComponentFixture<SettingsComponent>;
    let groupBalanceFixture: ComponentFixture<GroupBalanceComponent>;
    let confirmPaybackFixture: ComponentFixture<ConfirmPaybackModalComponent>;

    // Modals
    let createGroupMatDialogRef: jasmine.SpyObj<MatDialogRef<CreateGroupModalComponent>>;
    let addMemberMatDialogRef: jasmine.SpyObj<MatDialogRef<AddMemberToGroupModalComponent>>;
    let leaveGroupMatDialogRef: jasmine.SpyObj<MatDialogRef<LeaveGroupModalComponent>>;
    let paymentMatDialogRef: jasmine.SpyObj<MatDialogRef<PaymentModalComponent>>;
    let confirmPaybackMatDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmPaybackModalComponent>>;

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
        dataModelService = jasmine.createSpyObj('DataModelService', ['getUser', 'getGroups',
            'navItem$', 'getBalanceEmitter']);
        mockedClient = jasmine.createSpyObj('MatrixClient',
            ['setAccountData', 'getAccountDataFromServer', 'invite', 'getRoom', 'getUserId', 'sendEvent',
                'setRoomAccountData', 'createRoom', 'sendStateEvent', 'scrollback', 'leave', 'loginWithPassword', 'on', 'removeListener', 'clearStores',
                'removeListener', 'logout']);

        dataModelService.navItem$ = (new Subject()).asObservable();
        dataModelService.getBalanceEmitter.and.returnValue(new Subject<void>());
        classProviderSpy.createClient.and.returnValue(Promise.resolve(mockedClient));
        // @ts-ignore
        mockedClient.clearStores.and.returnValue(null);
        const spyDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        // Components
        TestBed.configureTestingModule({
            declarations: [ LoginComponent, GroupSelectionComponent, SettingsComponent, GroupTransactionComponent,
            GroupBalanceComponent, ReversePipePipe ],
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
        paymentMatDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<PaymentModalComponent>>;
        confirmPaybackMatDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ConfirmPaybackModalComponent>>;

        // Components
        loginFixture = TestBed.createComponent(LoginComponent);
        groupFixture = TestBed.createComponent(GroupSelectionComponent);
        createGroupFixture = TestBed.createComponent(CreateGroupModalComponent);
        groupTransactionFixture = TestBed.createComponent(GroupTransactionComponent);
        paymentModalFixture = TestBed.createComponent(PaymentModalComponent);
        addMemberFixture = TestBed.createComponent(AddMemberToGroupModalComponent);
        leaveGroupFixture = TestBed.createComponent(LeaveGroupModalComponent);
        settingsFixture = TestBed.createComponent(SettingsComponent);
        groupBalanceFixture = TestBed.createComponent(GroupBalanceComponent);
        confirmPaybackFixture = TestBed.createComponent(ConfirmPaybackModalComponent);

        loginComponent = loginFixture.componentInstance;
        groupComponent = groupFixture.componentInstance;
        createGroupComponent = createGroupFixture.componentInstance;
        groupTransactionComponent = groupTransactionFixture.componentInstance;
        paymentModal = paymentModalFixture.componentInstance;
        addMemberComponent = addMemberFixture.componentInstance;
        leaveGroupComponent = leaveGroupFixture.componentInstance;
        settingsComponent = settingsFixture.componentInstance;
        groupBalanceComponent = groupBalanceFixture.componentInstance;
        confirmPaybackComponent = confirmPaybackFixture.componentInstance;
    }));

    async function login(): Promise<ServerResponse> {
        const loginSpy = spyOn(matrixClientService, 'login').and.callThrough();

        // Mock the Client
        classProviderSpy.findClientConfig.and.callFake(() => {
            const config: DiscoveredClientConfig = {'m.homeserver': {'state': 'SUCCESS', 'error': '', 'base_url': 'https://host.com'}};
            return Promise.resolve(config);
        });
        mockedClient.loginWithPassword.and.returnValue(Promise.resolve({access_token: 'example_accessToken'}));
        mockedClient.setAccountData.and.returnValue(null);
        mockedClient.getAccountDataFromServer.and.returnValue(Promise.resolve(null));
        mockedClient.on.and.returnValue(null);

        // Login with these values
        loginComponent.matrixUrlControl.setValue('@abc:host');
        loginComponent.passwordControl.setValue('xyz');
        loginComponent.login();

        return await loginSpy.calls.mostRecent().returnValue;
    }

    async function preparedLogin(): Promise<ServerResponse> {
        const loginSpy = spyOn(matrixClientService, 'login').and.callThrough();

        // Mock the Client
        classProviderSpy.findClientConfig.and.callFake(() => {
            const config: DiscoveredClientConfig = {'m.homeserver': {'state': 'SUCCESS', 'error': '', 'base_url': 'https://host.com'}};
            return Promise.resolve(config);
        });
        mockedClient.loginWithPassword.and.returnValue(Promise.resolve({access_token: 'example_accessToken'}));
        mockedClient.setAccountData.and.returnValue(null);
        mockedClient.getAccountDataFromServer.and.returnValue(Promise.resolve(null));
        // @ts-ignore
        mockedClient.on.and.callFake((event: string, func: any) => {func('PREPARED', null, null);});

        // Login with these values
        loginComponent.matrixUrlControl.setValue('@abc:host');
        loginComponent.passwordControl.setValue('xyz');
        loginComponent.login();

        return await loginSpy.calls.mostRecent().returnValue;
    }

    // Test-case T10
    it('should login', async (done: DoneFn) => {
        const response = await login();

        // Expected
        expect(response).toBeDefined();
        expect(response instanceof SuccessfulResponse).toBe(true);
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

        // Spy
        const loginSpy = spyOn(matrixClientService, 'login').and.callThrough();

        // Login with these values
        loginComponent.matrixUrlControl.setValue('@abc:host');
        loginComponent.passwordControl.setValue('uvw');
        await loginComponent.login();

        // Expected
        const response = await loginSpy.calls.mostRecent().returnValue;
        expect(response instanceof UnsuccessfulResponse).toBe(true);
        expect(response.getError()).toBe(ClientError.InvalidPassword);
        expect(matrixClientService.isLoggedIn()).toBe(false);
        done();
    });

    // Test-case T30
    it('should create group', async (done: DoneFn) => {
        // Stub Values
        const c1 = new Contact('c1', 'Alice');
        const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
        const data = {
            groupName: 'Unigruppe',
            currency: Currency.USD
        };
        const g1 = new Group('g1', 'Unigruppe', Currency.USD);
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
        expect(basicSpy).toHaveBeenCalledWith('Unigruppe', matrixCurrencyMap[Currency.USD]);
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
        const g1 = new Group('g1', 'Unigruppe', Currency.USD);
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
        const g1 = new Group('g1', 'Unigruppe', Currency.USD);
        const g2 = new Group('g2', 'name_g2', Currency.USD);
        const data = {
            group: g1
        };
        g1.addGroupmember(new Groupmember(c1, g1));

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
        groupComponent.selectGroup(0);
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

    // Test Case T80
    it('should add expense', async (done: DoneFn) => {
        // Define Stub Values
        const c1 = new Contact('c1', 'A');
        const c2 = new Contact('c2', 'B');
        const c3 = new Contact('c3', 'C');
        const c4 = new Contact('c4', 'D');
        const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
        const g1 = new Group('g1', 'Unigruppe', Currency.USD);
        g1.addGroupmember(new Groupmember(c1, g1));
        g1.addGroupmember(new Groupmember(c2, g1));
        g1.addGroupmember(new Groupmember(c3, g1));
        g1.addGroupmember(new Groupmember(c4, g1));
        const data = {
            modalTitle: 'modalTitle',
            description: 'Essen',
            payer: c1,
            recipients: [c2, c3, c4],
            amount: [600, 600, 600],
            isAdded: [true, true, true],
            currency: Currency.USD
        };

        // Spies
        const basicSpy = spyOn(matrixBasicDataService, 'createTransaction').and.callThrough();
        // @ts-ignore
        const modalSpyOpen = spyOn(groupTransactionComponent.dialog, 'open').and.returnValue({afterClosed: () => of(data)});

        // Mocking
        dataModelService.getUser.and.returnValue(stubValueUser);
        dataModelService.getGroups.and.returnValue([g1]);
        mockedClient.sendEvent.and.returnValue(Promise.resolve({event_id: 'event_id'}));

        // login and preparation
        await preparedLogin();
        groupTransactionComponent.group = g1;
        groupTransactionComponent.ngOnChanges();

        // Add expense to group
        groupTransactionFixture.detectChanges();
        groupTransactionComponent.createExpense();
        paymentModal.data = data;
        paymentModal.ngOnInit();
        paymentModal.onSave();

        // Expected
        expect(modalSpyOpen).toHaveBeenCalled();
        expect(paymentMatDialogRef.close).toHaveBeenCalledWith(data);
        expect(basicSpy).toHaveBeenCalledWith('g1', 'Essen', 'c1', [ 'c2', 'c3', 'c4' ], [ 600, 600, 600 ], false);
        const actualResponse = await basicSpy.calls.mostRecent().returnValue;
        expect(actualResponse instanceof SuccessfulResponse).toBe(true);
        expect(actualResponse.getValue()).toBe('event_id');

        done();
    });

    // Test Case T110
    it('should confirm payback', async (done: DoneFn) => {
        // Define Stub Values
        const c1 = new Contact('c1', 'A');
        const c2 = new Contact('c2', 'B');
        const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
        const g1 = new Group('g1', 'Unigruppe', Currency.USD);
        g1.addGroupmember(new Groupmember(c1, g1));
        g1.addGroupmember(new Groupmember(c2, g1));
        const data = {
            recommendation: new Recommendation(g1, new AtomarChange(c1, 100), new AtomarChange(c2, -100))
        };
        g1.setRecommendations([data.recommendation]);

        // Spies
        const basicSpy = spyOn(matrixBasicDataService, 'createTransaction').and.callThrough();
        // @ts-ignore
        const modalSpyOpen = spyOn(groupBalanceComponent.dialog, 'open').and.returnValue({afterClosed: () => of(data)});

        // Mocking
        dataModelService.getUser.and.returnValue(stubValueUser);
        dataModelService.getGroups.and.returnValue([g1]);
        mockedClient.sendEvent.and.returnValue(Promise.resolve({event_id: 'event_id'}));

        // login and preparation
        await preparedLogin();
        groupBalanceComponent.group = g1;
        groupBalanceComponent.ngOnChanges();

        // Confirm Recommendation
        groupBalanceFixture.detectChanges();
        groupBalanceComponent.confirmPayback(0);
        confirmPaybackComponent.data = data;
        confirmPaybackComponent.onSave();

        // Expected
        expect(modalSpyOpen).toHaveBeenCalled();
        expect(confirmPaybackMatDialogRef.close).toHaveBeenCalledWith(data);
        expect(basicSpy).toHaveBeenCalledWith('g1', 'Payback from A to B', 'c1', [ 'c2' ], [ -100 ], true);
        const actualResponse = await basicSpy.calls.mostRecent().returnValue;
        expect(actualResponse instanceof SuccessfulResponse).toBe(true);
        expect(actualResponse.getValue()).toBe('event_id');

        done();
    });

    it('should logout', async (done: DoneFn) => {
        mockedClient.logout.and.returnValue(Promise.resolve());
        const dialogProvider = new DialogProviderService();
        const providerSpy = spyOn(dialogProvider, 'openErrorModal').and.callThrough();
        const clientSpy = spyOn(matrixClientService, 'logout').and.callThrough();
        const breakPointObserver = jasmine.createSpyObj('BreakPointObserver', ['observe']);
        breakPointObserver.observe.and.returnValue({pipe: () => {}});
        const comp = new NavigationMenuComponent(breakPointObserver, matrixClientService, null, dialogProvider, dataModelService);

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
