import { NgModule } from '@angular/core';
import {DashboardComponent} from "./dashboard.component";
import {MaterialModule} from "../material/material.module";
import {HttpClientModule} from "@angular/common/http";
import { SummaryChartComponent } from './summary-chart/summary-chart.component';



@NgModule({
  declarations: [
    DashboardComponent,
    SummaryChartComponent
  ],
  imports: [
    MaterialModule,
    HttpClientModule
  ]
})
export class DashboardModule { }
