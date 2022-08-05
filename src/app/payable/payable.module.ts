import { NgModule } from '@angular/core';
import {PayableComponent} from "./payable.component";
import {EditPayableDialogComponent} from "./payable-list/edit-payable-dialog/edit-payable-dialog.component";
import {DeletePayableDialogComponent} from "./payable-list/delete-payable-dialog/delete-payable-dialog.component";
import {MaterialModule} from "../material/material.module";
import {HttpClientModule} from "@angular/common/http";
import { PayableListComponent } from './payable-list/payable-list.component';



@NgModule({
  declarations: [
    PayableComponent,
    EditPayableDialogComponent,
    DeletePayableDialogComponent,
    PayableListComponent,
  ],
  imports: [
    MaterialModule,
    HttpClientModule
  ]
})
export class PayableModule { }
