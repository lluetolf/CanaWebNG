import { NgModule } from '@angular/core';
import {FieldComponent} from "./field.component";
import {CreateFieldDialogComponent} from "./field-list/create-field-dialog/create-field-dialog.component";
import {EditFieldDialogComponent} from "./field-list/edit-field-dialog/edit-field-dialog.component";
import {DeleteFieldDialogComponent} from "./field-list/delete-field-dialog/delete-field-dialog.component";
import {FieldListComponent} from "./field-list/field-list.component";
import {MaterialModule} from "../material/material.module";
import {HttpClientModule} from "@angular/common/http";



@NgModule({
  declarations: [
    FieldComponent,
    CreateFieldDialogComponent,
    EditFieldDialogComponent,
    DeleteFieldDialogComponent,
    FieldListComponent,
  ],
  imports: [
    MaterialModule,
    HttpClientModule
  ]
})
export class FieldModule { }
