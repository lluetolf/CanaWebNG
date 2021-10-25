import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {FieldComponent} from "./field/field.component";
import {PayableComponent} from "./payable/payable.component";
import {ReceivableComponent} from "./receivable/receivable.component";
import {AuthComponent} from "./auth/auth.component";

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'field', component: FieldComponent },
  { path: 'payable', component: PayableComponent },
  { path: 'receivable', component: ReceivableComponent },
  { path: 'auth', component: AuthComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
