import { NgModule } from '@angular/core';
import {MaterialModule} from "../material/material.module";
import {HttpClientModule} from "@angular/common/http";
import {AuthComponent} from "./auth.component";



@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    MaterialModule,
    HttpClientModule
  ]
})
export class AuthModule { }
