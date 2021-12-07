import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {Field} from "../field.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-field-dialog',
  templateUrl: './edit-field-dialog.component.html',
  styleUrls: ['./edit-field-dialog.component.scss']
})
export class EditFieldDialogComponent implements OnInit {
  initData!: Field;
  fieldForm!: FormGroup;


  constructor(@Inject(MAT_DIALOG_DATA) public data: {field: Observable<Field>},
              private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.data.field.subscribe(f => this.initData = f);
    this.fieldForm = this.fb.group({
      name: [this.initData.name, Validators.required],
      ingenioId: [this.initData.ingenioId, Validators.required],
      ownerId: [this.initData.ownerId, Validators.required],
      size: [this.initData.size, Validators.required],
      cultivatedArea: [this.initData.cultivatedArea, Validators.required],
      acquisitionDate: [this.initData.acquisitionDate, Validators.required],
      lastUpdated: [this.initData.lastUpdated, Validators.required],
    });
  }

  edit() {

  }
}
