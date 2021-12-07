import { Component, OnInit } from '@angular/core';
import {FieldService} from "./field.service";
import {Observable} from "rxjs";
import {Field} from "./field.model";
import {MatDialog} from "@angular/material/dialog";
import {EditFieldDialogComponent} from "./edit-field-dialog/edit-field-dialog.component";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  allFields$!: Observable<Field[]>

  constructor(private fieldService: FieldService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.allFields$ = this.fieldService.getFields()
  }

  editField(id: number) {
    let dialogRef = this.dialog.open(EditFieldDialogComponent, {
      height: '80%',
      width: '80%',
      data: { 'field': this.fieldService.getField(id)}
    });
  }
}
