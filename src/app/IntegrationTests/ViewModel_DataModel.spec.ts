import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LoginComponent} from "../ViewModel/login/login.component";
import {DataModelService} from "../DataModel/data-model.service";
import {MatrixClientService} from "../ServerCommunication/CommunicationInterface/matrix-client.service";
import {GroupSelectionComponent} from "../ViewModel/group-selection/group-selection.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MockDialog} from "../ViewModel/_mockServices/MockDialog";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {SuccessfulResponse} from "../ServerCommunication/Response/SuccessfulResponse";
import {SettingsComponent} from "../ViewModel/settings/settings.component";
import {GroupBalanceComponent} from "../ViewModel/group-balance/group-balance.component";
import {HomeComponent} from "../ViewModel/home/home.component";
import {Currency} from "../DataModel/Utils/Currency";
import {Group} from "../DataModel/Group/Group";
import {Recommendation} from "../DataModel/Group/Recommendation";
import {Groupmember} from "../DataModel/Group/Groupmember";
import {Contact} from "../DataModel/Group/Contact";


describe('ViewModel_DataModel', () => {
    // Components
    let groupBalanceComponent: GroupBalanceComponent;
    let groupSelectionComponent: GroupSelectionComponent;
    let homeComponent: HomeComponent;
    let loginComponent: LoginComponent;
    let settingsComponent: SettingsComponent;

    // Fixtures
    let groupBalanceFixture: ComponentFixture<GroupBalanceComponent>;
    let groupSelectionFixture: ComponentFixture<GroupSelectionComponent>;
    let homeFixture: ComponentFixture<HomeComponent>;
    let loginFixture: ComponentFixture<LoginComponent>;
    let settingsFixture: ComponentFixture<SettingsComponent>;

    // Mocked Client and client service
    let matrixClientService: jasmine.SpyObj<MatrixClientService>;

    // Real Services
    let dataModelService: DataModelService;

    beforeEach(async(() => {
        matrixClientService = jasmine.createSpyObj('MatrixClientService', ['login', 'isLoggedIn', 'isPrepared']);
        const spyDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        // Components
        TestBed.configureTestingModule({
            declarations: [GroupBalanceComponent, GroupSelectionComponent, HomeComponent, LoginComponent, SettingsComponent],
            providers: [
                {provide: MatrixClientService, useValue: matrixClientService},
                {provide: MatDialog, useValue: MockDialog},
                {provide: MatDialogRef, useValue: spyDialogRef},
                {provide: MAT_DIALOG_DATA, useValue: []},
                DataModelService
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        // Mock Services
        matrixClientService = TestBed.inject(MatrixClientService) as jasmine.SpyObj<MatrixClientService>;

        // Real Services
        dataModelService = TestBed.inject(DataModelService);

        // Components
        groupBalanceFixture = TestBed.createComponent(GroupBalanceComponent);
        groupSelectionFixture = TestBed.createComponent(GroupSelectionComponent);
        homeFixture = TestBed.createComponent(HomeComponent);
        loginFixture = TestBed.createComponent(LoginComponent);
        settingsFixture = TestBed.createComponent(SettingsComponent);

        groupBalanceComponent = groupBalanceFixture.componentInstance;
        groupSelectionComponent = groupSelectionFixture.componentInstance;
        homeComponent = homeFixture.componentInstance;
        loginComponent = loginFixture.componentInstance;
        settingsComponent = settingsFixture.componentInstance;
    }));

    async function login(): Promise<void> {
        // Mock the Client
        matrixClientService.login.and.returnValue(Promise.resolve(new SuccessfulResponse()));
        matrixClientService.isLoggedIn.and.returnValue(true);

        // Login with these values
        loginComponent.matrixUrlControl.setValue('@username:host');
        loginComponent.passwordControl.setValue('password123');
        await loginComponent.login();
    }

    // Group Balance Component
    it('should display recommendations and balances', () => {
        dataModelService.initializeUserFirstTime('c1', 'Alice');
        const userContact = dataModelService.getUser().contact;

        const g1 = dataModelService.getUser().createGroup('id_1', 'group_1', Currency.USD);
        const g2 = dataModelService.getUser().createGroup('id_2', 'group_2', Currency.USD);
        const c2 = new Contact('c2', 'Bob');
        const c3 = new Contact('c3', 'Eve');
        const mg1_a = new Groupmember(userContact, g1);
        mg1_a.balance = 5;
        const mg1_b = new Groupmember(c2, g1);
        mg1_b.balance = -5;
        const mg2_a = new Groupmember(userContact, g2);
        mg2_a.balance = -10;
        const mg2_b = new Groupmember(c3, g2);
        mg2_b.balance = 10;
        g1.addGroupmember(mg1_a);
        g1.addGroupmember(mg1_b);
        g2.addGroupmember(mg2_a);
        g2.addGroupmember(mg2_b);
        g1.setRecommendations([new Recommendation(g1, null, null)]);
        g2.setRecommendations([new Recommendation(g2, null, null)]);

        // Expectations
        groupBalanceComponent.group = g1;
        groupBalanceComponent.ngOnChanges();
        expect(groupBalanceComponent.recommendations).toEqual(g1.recommendations);
        expect(groupBalanceComponent.userContact).toBe(userContact);
        expect(groupBalanceComponent.balanceData).toEqual([{ name: 'Alice', value: 0.05 }, { name: 'Bob', value: -0.05 }]);
        expect(groupBalanceComponent.getCustomColor(userContact.name)).toBe('green');
        expect(groupBalanceComponent.getCustomColor(c2.name)).toBe('red');

        // Change selected group
        groupBalanceComponent.group = g2;
        groupBalanceComponent.ngOnChanges();
        expect(groupBalanceComponent.recommendations).toEqual(g2.recommendations);
        expect(groupBalanceComponent.userContact).toBe(userContact);
        expect(groupBalanceComponent.balanceData).toEqual([{ name: 'Alice', value: -0.1 }, { name: 'Eve', value: 0.1 }]);
        expect(groupBalanceComponent.getCustomColor(userContact.name)).toBe('red');
        expect(groupBalanceComponent.getCustomColor(c3.name)).toBe('green');
    });
});
