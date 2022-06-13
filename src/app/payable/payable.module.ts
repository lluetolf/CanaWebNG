import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PayableComponent} from "./payable.component";
import {EditPayableDialogComponent} from "./edit-payable-dialog/edit-payable-dialog.component";
import {CreatePayableDialogComponent} from "./create-payable-dialog/create-payable-dialog.component";
import {DeletePayableDialogComponent} from "./delete-payable-dialog/delete-payable-dialog.component";
import {MaterialModule} from "../material/material.module";
import {HttpClientModule} from "@angular/common/http";
import { PayableListComponent } from './payable-list/payable-list.component';
import { PayableDateSelectorComponent } from './payable-date-selector/payable-date-selector.component';



@NgModule({
  declarations: [
    PayableComponent,
    EditPayableDialogComponent,
    CreatePayableDialogComponent,
    DeletePayableDialogComponent,
    PayableListComponent,
    PayableDateSelectorComponent,
  ],
  imports: [
    MaterialModule,
    HttpClientModule
  ]
})
export class PayableModule { }
