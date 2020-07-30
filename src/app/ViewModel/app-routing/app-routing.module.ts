import { NgModule } from '@angular/core';
import {SettingsComponent} from '../settings/settings.component';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
