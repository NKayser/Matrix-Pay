import { NgModule } from '@angular/core';
import {SettingsComponent} from '../settings/settings.component';
import {GroupSelectionComponent} from '../group-selection/group-selection.component';
import { Routes, RouterModule } from '@angular/router';
import {HistoryComponent} from '../history/history.component';
import {HomeComponent} from '../home/home.component';
import {PageNotFoundComponent} from '../page-not-found/page-not-found.component';
import {LoginComponent} from '../login/login.component';


const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: 'groups', component: GroupSelectionComponent},
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: '',   redirectTo: '/home', pathMatch: 'full' }, // redirect to home site
  { path: '**', component: PageNotFoundComponent }, // redirect to page not found site if link is invalid
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
