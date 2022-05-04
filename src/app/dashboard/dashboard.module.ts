import { NgModule } from '@angular/core';
import {DashboardComponent} from "./dashboard.component";
import {MaterialModule} from "../material/material.module";
import {HttpClientModule} from "@angular/common/http";



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    MaterialModule,
    HttpClientModule
  ]
})
export class DashboardModule { }
