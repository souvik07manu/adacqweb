import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { MapnotesComponent } from './mapnotes/mapnotes.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FieldsComponent } from './fields/fields.component';
import { AddmapsComponent } from './addmaps/addmaps.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminviewfieldsComponent } from './adminviewfields/adminviewfields.component';
import { AdminviewgeodataComponent } from './adminviewgeodata/adminviewgeodata.component';
import { ComparisonComponent } from './comparison/comparison.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'adminviewfield',
    component: AdminviewfieldsComponent,
  },
  {
    path: 'comparison',
    component: ComparisonComponent,
  },
  {
    path: 'adminviewgeodata',
    component: AdminviewgeodataComponent,
  },
  { 
    path: 'notes/:field_id',
    component: MapnotesComponent,
  },
  { 
    path: 'fields',
    component: FieldsComponent,
  },
  {
    path: 'addmaps',
    component: AddmapsComponent,
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }