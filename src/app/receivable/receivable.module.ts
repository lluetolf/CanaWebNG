import { NgModule } from '@angular/core';
import {MaterialModule} from "../material/material.module";
import {HttpClientModule} from "@angular/common/http";
import {ReceivableComponent} from "./receivable.component";
import { ReceivableListComponent } from './receivable-list/receivable-list.component';
import { ReceivableDetailComponent } from './receivable-detail/receivable-detail.component';

@NgModule({
  declarations: [
    ReceivableComponent,
    ReceivableListComponent,
    ReceivableDetailComponent
  ],
  imports: [
    MaterialModule,
    HttpClientModule
  ]
})
export class ReceivableModule { }
