import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {LoginComponent} from "../ViewModel/login/login.component";
import {DataModelService} from "../DataModel/data-model.service";
import {MatrixClientService} from "../ServerCommunication/CommunicationInterface/matrix-client.service";
import {DiscoveredClientConfig, MatrixClient} from "../../matrix";
import {GroupSelectionComponent} from "../ViewModel/group-selection/group-selection.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MockDialog, MockDialogCancel} from "../ViewModel/_mockServices/MockDialog";
import {CreateGroupModalComponent} from "../ViewModel/create-group-modal/create-group-modal.component";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {SuccessfulResponse} from "../ServerCommunication/Response/SuccessfulResponse";
import {AddMemberToGroupModalComponent} from "../ViewModel/add-user-to-group-modal/add-member-to-group-modal.component";
import {LeaveGroupModalComponent} from "../ViewModel/leave-group-modal/leave-group-modal.component";
import {SettingsComponent} from "../ViewModel/settings/settings.component";


describe('ViewModel_DataModel', () => {
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

    // Mocked Client and client service
    let matrixClientService: jasmine.SpyObj<MatrixClientService>;

    // Real Services
    let dataModelService: DataModelService;

    beforeEach(async(() => {
        matrixClientService = jasmine.createSpyObj('MatrixClientService', ['login', 'isLoggedIn', 'isPrepared']);
        const spyDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        // Components
        TestBed.configureTestingModule({
            declarations: [LoginComponent, GroupSelectionComponent, SettingsComponent],
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
        matrixClientService.login.and.returnValue(Promise.resolve(new SuccessfulResponse()));
        matrixClientService.isLoggedIn.and.returnValue(true);

        // Login with these values
        loginComponent.matrixUrlControl.setValue('@username:host');
        loginComponent.passwordControl.setValue('password123');
        await loginComponent.login();
    }

    it('should login', async (done: DoneFn) => {
        await login();

        // Expected
        expect(matrixClientService.isLoggedIn()).toBe(true);
        done();
    });
});
