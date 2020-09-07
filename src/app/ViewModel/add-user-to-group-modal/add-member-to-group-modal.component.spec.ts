import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberToGroupModalComponent } from './add-member-to-group-modal.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from '@angular/cdk/layout';
import {BrowserModule} from '@angular/platform-browser';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {AppRoutingModule} from '../app-routing/app-routing.module';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatGridListModule} from '@angular/material/grid-list';
import {PaymentModalComponent} from '../payment-modal/payment-modal.component';
import {Currency} from '../../DataModel/Utils/Currency';
import {Group} from '../../DataModel/Group/Group';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";

describe('AddUserToGroupModalComponent', () => {
  let component: AddMemberToGroupModalComponent;
  let fixture: ComponentFixture<AddMemberToGroupModalComponent>;
  let matDialogRef: jasmine.SpyObj<MatDialogRef<AddMemberToGroupModalComponent>>;

  beforeEach(async(() => {

    const spyDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [ AddMemberToGroupModalComponent ],
      providers: [
        { provide: MatDialogRef, useValue: spyDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();


    matDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AddMemberToGroupModalComponent>>;
    fixture = TestBed.createComponent(AddMemberToGroupModalComponent);
    component = fixture.componentInstance;
  }));

  it('cancel', () => {
    component.onCancel();
    expect(matDialogRef.close).toHaveBeenCalled();
  });

  it('check error messages', () => {
    expect(component.getInvalidUserErrorMessage()).toEqual('Not a valid user name');
  });

  it('confirm', () => {

    const g1 = new Group('g1', 'name_g1', Currency.EUR);

    const data = {
      group: g1,
      user: '@username:host'
    };

    component.data = data;
    component.ngOnInit();

    component.onSave();
    expect(matDialogRef.close).toHaveBeenCalledWith(data);

  });

  it('confirm invalid user', () => {

    const g1 = new Group('g1', 'name_g1', Currency.EUR);

    const data = {
      group: g1,
      user: 'u1'
    };

    component.data = data;
    component.ngOnInit();

    component.onSave();
    expect(matDialogRef.close).not.toHaveBeenCalled();

  });
});
