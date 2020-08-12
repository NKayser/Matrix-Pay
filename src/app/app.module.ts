import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './ViewModel/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NavigationMenuComponent } from './ViewModel/navigation-menu/navigation-menu.component';
import { LayoutModule } from '@angular/cdk/layout';
import { SettingsComponent } from './ViewModel/settings/settings.component';
import { AppRoutingModule } from './ViewModel/app-routing/app-routing.module';
import { GroupSelectionComponent } from './ViewModel/group-selection/group-selection.component';
import { GroupTransactionComponent } from './ViewModel/group-transaction/group-transaction.component';
import { GroupBalanceComponent } from './ViewModel/group-balance/group-balance.component';
import { PaymentModalComponent } from './ViewModel/payment-modal/payment-modal.component';
import { HistoryComponent } from './ViewModel/history/history.component';
import { HomeComponent } from './ViewModel/home/home.component';
import { PageNotFoundComponent } from './ViewModel/page-not-found/page-not-found.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { LeaveGroupModalComponent } from './ViewModel/leave-group-modal/leave-group-modal.component';
import { CreateGroupModalComponent } from './ViewModel/create-group-modal/create-group-modal.component';
import { AddMemberToGroupModalComponent } from './ViewModel/add-user-to-group-modal/add-member-to-group-modal.component';
import { ConfirmPaybackModalComponent } from './ViewModel/confirm-payback-modal/confirm-payback-modal.component';
import { ErrorModalComponent } from './ViewModel/error-modal/error-modal.component';
import {MatGridListModule} from '@angular/material/grid-list';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigationMenuComponent,
    SettingsComponent,
    GroupSelectionComponent,
    GroupTransactionComponent,
    GroupBalanceComponent,
    PaymentModalComponent,
    HistoryComponent,
    HomeComponent,
    PageNotFoundComponent,
    LeaveGroupModalComponent,
    CreateGroupModalComponent,
    AddMemberToGroupModalComponent,
    ConfirmPaybackModalComponent,
    ErrorModalComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        FormsModule,
        MatButtonModule,
        MatSelectModule,
        MatRadioModule,
        ReactiveFormsModule,
        LayoutModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatTabsModule,
        MatDialogModule,
        AppRoutingModule,
        NgxChartsModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatGridListModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
