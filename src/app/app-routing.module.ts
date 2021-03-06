import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FieldListComponent } from './fields/field-list/field-list.component';
import { VersionPageComponent } from './version-page/version-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PayableListComponent } from './payable/payable-list/payable-list.component';
import { LoginComponent } from './login/login.component';

import { AuthGuard } from '@app/helpers';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'version', component: VersionPageComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'payableList', component: PayableListComponent, canActivate: [AuthGuard] },
  { path: 'payableList/:day', component: PayableListComponent, canActivate: [AuthGuard] },
  { path: 'receivableList', component: FieldListComponent, canActivate: [AuthGuard] },
  { path: 'fieldList', component: FieldListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { enableTracing: false }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }

