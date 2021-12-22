import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {Field} from "../../field.model";
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {FieldService} from "../../field.service";
import {first} from "rxjs/operators";
import {LoggingService} from "../../../logging/logging.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-field-dialog',
  templateUrl: './edit-field-dialog.component.html',
  styleUrls: ['./edit-field-dialog.component.scss']
})
export class EditFieldDialogComponent implements OnInit {
  initData!: Field;
  fieldForm!: FormGroup;
  loading = false;
  private isCreateMode!: boolean;
  private fieldId!: number;


  constructor(@Inject(MAT_DIALOG_DATA) public data: {fieldId: number},
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private fieldService: FieldService,
              private logger: LoggingService,
              public dialogRef: MatDialogRef<EditFieldDialogComponent>) {

  }

  ngOnInit(): void {
    this.fieldId = this.data.fieldId
    this.isCreateMode = !this.fieldId;
    this.logger.debug(`ID: ${this.fieldId} and CreateMode: ${this.isCreateMode}`)

    //TODO valided dates and improve HTML form.
    this.fieldForm = this.fb.group({
      name: ['', Validators.required],
      ingenioId: ['', Validators.required],
      ownerId: ['', Validators.required],
      size: ['', Validators.required],
      cultivatedArea: ['', Validators.required],
      acquisitionDate: ['', Validators.required],
      lastUpdated: ['', Validators.required],
    });

    if(!this.isCreateMode) {
      this.fieldService.getField(this.fieldId)
        .pipe(first())
        .subscribe(x => this.fieldForm.patchValue(x!));
    }
  }

  save() {
    if (this.fieldForm.invalid) {
      this.getFormValidationErrors()
      return;
    }

    this.loading = true;
    if( this.isCreateMode)
      this.create();
    else
      this.update();
  }

  private update() {
    this.fieldService.update(this.initData.id, this.fieldForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.logger.info('Update successful')
          this.dialogRef.close()
        },
        error: error => {
          this.logger.error(error)
          this.loading = false;
        }
      });
  }

  cancel() {
    //TODO: fix error ID not set being raised
    this.dialogRef.close()
  }

  private create() {
    this.fieldService.create(this.fieldForm.value)
      .pipe(first())
      .subscribe({
        next: f => {
          this.logger.info(`Created successful with id:${f.id}`)
          this.dialogRef.close()
        },
        error: error => {
          this.logger.error(error)
          this.loading = false;
        }
      });
  }

  private getFormValidationErrors() {
    Object.keys(this.fieldForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.fieldForm.get(key)!.errors!;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          this.logger.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }
}
