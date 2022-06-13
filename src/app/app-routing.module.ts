import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {FieldComponent} from "./field/field.component";
import {PayableComponent} from "./payable/payable.component";
import {ReceivableComponent} from "./receivable/receivable.component";
import {AuthComponent} from "./auth/auth.component";
import {AuthGuard} from "./auth/auth.guard";

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'field', component: FieldComponent, canActivate: [AuthGuard]},
  { path: 'payable', component: PayableComponent, canActivate: [AuthGuard]},
  { path: 'receivable', component: ReceivableComponent, canActivate: [AuthGuard]},
  { path: 'auth', component: AuthComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, )], //{enableTracing: true}
  exports: [RouterModule]
})
export class AppRoutingModule { }
