import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LoginComponent} from '../ViewModel/login/login.component';
import {DataModelService} from '../DataModel/data-model.service';
import {MatrixClientService} from '../ServerCommunication/CommunicationInterface/matrix-client.service';
import {GroupSelectionComponent} from '../ViewModel/group-selection/group-selection.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MockDialog} from '../ViewModel/_mockServices/MockDialog';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {SettingsComponent} from '../ViewModel/settings/settings.component';
import {GroupBalanceComponent} from '../ViewModel/group-balance/group-balance.component';
import {HomeComponent} from '../ViewModel/home/home.component';
import {Currency} from '../DataModel/Utils/Currency';
import {Recommendation} from '../DataModel/Group/Recommendation';
import {Groupmember} from '../DataModel/Group/Groupmember';
import {Contact} from '../DataModel/Group/Contact';
import {AtomarChange} from '../DataModel/Group/AtomarChange';
import {Transaction} from '../DataModel/Group/Transaction';
import {TransactionType} from '../DataModel/Group/TransactionType';
import {GroupTransactionComponent} from '../ViewModel/group-transaction/group-transaction.component';
import {ReversePipePipe} from '../ViewModel/reverse-pipe.pipe';


describe('ViewModel_DataModel', () => {
    // Components
    let groupBalanceComponent: GroupBalanceComponent;
    let groupSelectionComponent: GroupSelectionComponent;
    let groupTransactionComponent: GroupTransactionComponent;
    let homeComponent: HomeComponent;
    let loginComponent: LoginComponent;
    let settingsComponent: SettingsComponent;

    // Fixtures
    let groupBalanceFixture: ComponentFixture<GroupBalanceComponent>;
    let groupSelectionFixture: ComponentFixture<GroupSelectionComponent>;
    let groupTransactionFixture: ComponentFixture<GroupTransactionComponent>;
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
            declarations: [GroupBalanceComponent, GroupSelectionComponent, HomeComponent, LoginComponent,
                SettingsComponent, GroupTransactionComponent, ReversePipePipe],
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
        groupTransactionFixture = TestBed.createComponent(GroupTransactionComponent);
        homeFixture = TestBed.createComponent(HomeComponent);
        loginFixture = TestBed.createComponent(LoginComponent);
        settingsFixture = TestBed.createComponent(SettingsComponent);

        groupBalanceComponent = groupBalanceFixture.componentInstance;
        groupSelectionComponent = groupSelectionFixture.componentInstance;
        groupTransactionComponent = groupTransactionFixture.componentInstance;
        homeComponent = homeFixture.componentInstance;
        loginComponent = loginFixture.componentInstance;
        settingsComponent = settingsFixture.componentInstance;
    }));

    // Group Balance Component
    it('should display recommendations and balances in group', () => {
        const userContact = dataModelService.initializeUserFirstTime('c1', 'Alice').contact;

        const g1 = dataModelService.getUser().createGroup('id_1', 'group_1', Currency.USD);
        const g2 = dataModelService.getUser().createGroup('id_2', 'group_2', Currency.USD);
        const c2 = new Contact('c2', 'Bob');
        const c3 = new Contact('c3', 'Eve');
        const mg1A = new Groupmember(userContact, g1);
        mg1A.balance = 5;
        const mg1B = new Groupmember(c2, g1);
        mg1B.balance = -5;
        const mg2A = new Groupmember(userContact, g2);
        mg2A.balance = -10;
        const mg2B = new Groupmember(c3, g2);
        mg2B.balance = 10;
        g1.addGroupmember(mg1A);
        g1.addGroupmember(mg1B);
        g2.addGroupmember(mg2A);
        g2.addGroupmember(mg2B);
        g1.setRecommendations([new Recommendation(g1, new AtomarChange(c2, -5), new AtomarChange(userContact, 5))]);
        g2.setRecommendations([new Recommendation(g2, new AtomarChange(userContact, -10), new AtomarChange(c3, 10))]);

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

    // Group selection Component
    it('should list all groups', () => {
        dataModelService.initializeUserFirstTime('c1', 'Alice');
        const user = dataModelService.getUser();

        user.createGroup('g1', 'name_g1', Currency.USD);
        user.createGroup('g2', 'name_g2', Currency.USD);
        groupSelectionFixture.detectChanges();

        const nativeElement: HTMLElement = groupSelectionFixture.nativeElement;
        const matLabel = nativeElement.querySelector('mat-label');
        expect(matLabel.textContent).toEqual('name_g1');

        expect(groupSelectionComponent.currentGroup.groupId).toEqual('g1');
        expect(groupSelectionComponent.groups.length).toEqual(2);
        groupSelectionComponent.selectGroup(1);
        groupSelectionFixture.detectChanges();
        expect(groupSelectionComponent.currentGroup.groupId).toEqual('g2');
        expect(matLabel.textContent).toEqual('name_g2');
    });

    // Group Transaction Component
    it('should display group transactions', () => {
        dataModelService.initializeUserFirstTime('c1', 'Alice');
        const user = dataModelService.getUser();

        const g1 = user.createGroup('g1', 'name_g1', Currency.USD);
        const mg1 = new Groupmember(user.contact, g1);
        g1.addGroupmember(mg1);
        const t1 = new Transaction(TransactionType.EXPENSE, 't1', 'name_t1', new Date('05.05.2005'), g1,
            new AtomarChange(user.contact, 10),
            [
                new AtomarChange(new Contact('c2', 'Bob'), -5),
                new AtomarChange(new Contact('c3', 'Eve'), -5),
            ], mg1);
        g1.addTransaction(t1);

        groupTransactionComponent.group = g1;
        groupTransactionComponent.ngOnChanges();
        groupTransactionFixture.detectChanges();

        const nativeElement: HTMLElement = groupTransactionFixture.nativeElement;

        expect(groupTransactionComponent.group).toBe(g1);
        expect(groupTransactionComponent.transactions).toEqual([t1]);
        expect(nativeElement.querySelector('.title').textContent).toEqual(t1.name);
        expect(nativeElement.querySelector('.description_left').textContent).toEqual('0.1$ paid by ' + t1.payer.contact.name);
    });

    // Home Component
    it('show recommendations on home view', () => {
        const c1 = dataModelService.initializeUserFirstTime('c1', 'Alice').contact;
        const c2 = new Contact('c2', 'Bob');
        const g1 = dataModelService.getUser().createGroup('g1', 'name_g1', Currency.EUR);
        const gm1 = new Groupmember(c1, g1);
        const gm2 = new Groupmember(c2, g1);
        g1.addGroupmember(gm1);
        g1.addGroupmember(gm2);
        const r1 = new Recommendation(g1, new AtomarChange(c1, 100), new AtomarChange(c2, -100));
        g1.setRecommendations([r1]);

        homeFixture.detectChanges();

        expect(homeComponent.recommendations).toEqual([r1]);

        const nativeElement: HTMLElement = homeFixture.nativeElement;
        expect(nativeElement.querySelector('.approve_person').textContent).toBe('You owe Bob');
        expect(nativeElement.querySelector('.approve_group').textContent).toBe('name_g1');
        expect(nativeElement.querySelector('.approve_amount').textContent).toBe('1€');
    });

    it('show total Balances on home view', () => {
        const c1 = dataModelService.initializeUserFirstTime('c1', 'Alice').contact;

        const g1 = dataModelService.getUser().createGroup('g1', 'name_g1', Currency.USD);
        const g2 = dataModelService.getUser().createGroup('g2', 'name_g2', Currency.USD);
        const g3 = dataModelService.getUser().createGroup('g3', 'name_g3', Currency.EUR);
        const g4 = dataModelService.getUser().createGroup('g4', 'name_g4', Currency.EUR);

        const mg1 = new Groupmember(c1, g1);
        mg1.balance = 5;
        g1.addGroupmember(mg1);
        const mg2 = new Groupmember(c1, g2);
        mg2.balance = 10;
        g2.addGroupmember(mg2);
        const mg3 = new Groupmember(c1, g3);
        mg3.balance = 7;
        g3.addGroupmember(mg3);
        const mg4 = new Groupmember(c1, g4);
        mg4.balance = 6;
        g4.addGroupmember(mg4);

        homeFixture.detectChanges();

        expect(homeComponent.getTotalBalance(Currency.USD)).toBe(15);
        expect(homeComponent.getTotalBalance(Currency.EUR)).toBe(13);
        expect(homeFixture.nativeElement.querySelectorAll('.balance_number')[0].textContent).toBe('0.15');
        expect(homeFixture.nativeElement.querySelectorAll('.balance_number')[1].textContent).toBe('0.13');
    });

    // Settings Component
    it ('should display settings (default currency)', () => {
        dataModelService.initializeUserFirstTime('c1', 'Alice');
        dataModelService.getUser().currency = Currency.USD;
        settingsFixture.detectChanges();
        expect(settingsComponent.selectedCurrency).toBe(Currency.USD);
        expect(settingsFixture.nativeElement.querySelector('mat-option').textContent).toBe('€');
    });
});
