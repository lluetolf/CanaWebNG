import { NgModule } from '@angular/core';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from "@angular/fire/auth";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MaterialModule } from './material/material.module';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { FooterComponent } from './layout/footer/footer.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./auth/auth.interceptor";
import {environment} from "../environments/environment";
import {FieldModule} from "./field/field.module";
import {PayableModule} from "./payable/payable.module";
import {DashboardModule} from "./dashboard/dashboard.module";
import {AuthModule} from "./auth/auth.module";
import {CacheInterceptor} from "./global/cache.interceptor";
import { ReceivableModule } from './receivable/receivable.module';


@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NavigationComponent,
    FooterComponent,
  ],
  imports: [
    provideAuth(() => {
      console.log("Hello provideAuth")
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, "http://localhost:9099")
      }
      return (auth);
    }),
    provideFirebaseApp(() => {
      const firebaseApp = initializeApp(environment.firebase)
      return (firebaseApp);
    }),
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    AuthModule,
    FieldModule,
    PayableModule,
    ReceivableModule,
    DashboardModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
