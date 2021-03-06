import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VersionPageComponent } from './version-page/version-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FieldsModule } from './fields/fields.module';
import { MaterialModule } from './shared/material.module';
import { InMemoryDataService } from './in-memory-data.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditFieldDialogComponent } from './fields/edit-field-dialog/edit-field-dialog.component';
import { CreateFieldDialogComponent } from './fields/create-field-dialog/create-field-dialog.component';
import { PayablesModule } from './payable/payables.module';
import { LoginComponent } from './login/login.component';

import { JwtInterceptor, ErrorInterceptor } from '@app/helpers';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    VersionPageComponent,
    PageNotFoundComponent,
    DashboardComponent,
    LoginComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    MaterialModule,
    BrowserAnimationsModule,
    BrowserModule,
    FieldsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    // HttpClientInMemoryWebApiModule.forRoot(
    //  InMemoryDataService, { dataEncapsulation: false }
    // ),

    PayablesModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  entryComponents: [EditFieldDialogComponent, CreateFieldDialogComponent, ConfirmationDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
