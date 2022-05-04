import { NgModule } from '@angular/core';
import {ReceivableComponent} from "./receivable.component";
import {MaterialModule} from "../material/material.module";
import {HttpClientModule} from "@angular/common/http";



@NgModule({
  declarations: [
    ReceivableComponent
  ],
  imports: [
    MaterialModule,
    HttpClientModule
  ]
})
export class ReceivableModule { }
