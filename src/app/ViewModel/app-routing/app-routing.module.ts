import { NgModule } from '@angular/core';
import {SettingsComponent} from '../settings/settings.component';
import {GroupSelectionComponent} from '../group-selection/group-selection.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: 'groups', component: GroupSelectionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
