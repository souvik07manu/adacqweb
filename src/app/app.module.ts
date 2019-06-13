import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MapnotesComponent } from './mapnotes/mapnotes.component';
import { AppRoutingModule } from './/app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FieldsComponent } from './fields/fields.component';
import { AddmapsComponent } from './addmaps/addmaps.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminviewfieldsComponent } from './adminviewfields/adminviewfields.component';
import { AdminviewgeodataComponent } from './adminviewgeodata/adminviewgeodata.component';
import { ComparisonComponent } from './comparison/comparison.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MapnotesComponent,
    FieldsComponent,
    AddmapsComponent,
    HeaderComponent,
    DashboardComponent,
    AdminviewfieldsComponent,
    AdminviewgeodataComponent,
    ComparisonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpModule,
    NgxSpinnerModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
