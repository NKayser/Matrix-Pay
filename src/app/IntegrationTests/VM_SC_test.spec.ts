import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {GroupSelectionComponent} from "../ViewModel/group-selection/group-selection.component";
import {DataModelService} from "../DataModel/data-model.service";
import {MatrixBasicDataService} from "../ServerCommunication/CommunicationInterface/matrix-basic-data.service";
import {GroupTransactionComponent} from "../ViewModel/group-transaction/group-transaction.component";
import {HistoryComponent} from "../ViewModel/history/history.component";
import {GroupBalanceComponent} from "../ViewModel/group-balance/group-balance.component";
import {MatDialog} from "@angular/material/dialog";
import {MockDialog, MockDialogCancel} from "../ViewModel/_mockServices/MockDialog";
import {Contact} from "../DataModel/Group/Contact";
import {User} from "../DataModel/User/User";
import {Currency} from "../DataModel/Utils/Currency";
import {Language} from "../DataModel/Utils/Language";
import {Group} from "../DataModel/Group/Group";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";


describe('GroupSelectionComponentConfirm', () => {
    let component: GroupSelectionComponent;
    let fixture: ComponentFixture<GroupSelectionComponent>;

    let dataModelService: jasmine.SpyObj<DataModelService>;
    let matrixBasicDataService: jasmine.SpyObj<MatrixBasicDataService>;

    beforeEach(async(() => {

        const spyData = jasmine.createSpyObj('DataModelService', ['getUser', 'getGroups']);
        const spyMatrix = jasmine.createSpyObj('MatrixBasicDataService', ['groupAddMember', 'leaveGroup', 'groupCreate']);

        TestBed.configureTestingModule({
            declarations: [GroupSelectionComponent, GroupTransactionComponent, HistoryComponent, GroupBalanceComponent],
            providers: [
                { provide: MatDialog, useValue: MockDialog },
                { provide: MatrixBasicDataService, useValue: spyMatrix},
                { provide: DataModelService, useValue: spyData}
            ],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
        }).compileComponents();

        dataModelService = TestBed.inject(DataModelService) as jasmine.SpyObj<DataModelService>;
        matrixBasicDataService = TestBed.inject(MatrixBasicDataService) as jasmine.SpyObj<MatrixBasicDataService>;

        fixture = TestBed.createComponent(GroupSelectionComponent);
        component = fixture.componentInstance;
    }));

    it('check create group confirm', () => {
        const c1 = new Contact('c1', 'Alice');
        const stubValueUser = new User(c1, Currency.USD, Language.GERMAN);
        dataModelService.getUser.and.returnValue(stubValueUser);

        const g1 = new Group('g1', 'name_g1', Currency.USD);
        const g2 = new Group('g2', 'name_g2', Currency.USD);

        dataModelService.getGroups.and.returnValue([g1, g2]);
        fixture.detectChanges();
        component.addGroup();
        expect(matrixBasicDataService.groupCreate).toHaveBeenCalled();
    });
});
