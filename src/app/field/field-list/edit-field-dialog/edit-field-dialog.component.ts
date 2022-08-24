import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators} from "@angular/forms";
import {FieldService} from "../../field.service";
import {first} from "rxjs/operators";
import {LoggingService} from "../../../logging/logging.service";

@Component({
  selector: 'app-edit-field-dialog',
  templateUrl: './edit-field-dialog.component.html',
  styleUrls: ['./edit-field-dialog.component.scss']
})
export class EditFieldDialogComponent implements OnInit {
  fieldForm!: UntypedFormGroup;
  loading = false;
  title = ""
  public isCreateMode!: boolean;
  private fieldName!: string;
  errorMsg: string | undefined = undefined;
  public dialogRef!: MatDialogRef<EditFieldDialogComponent>;


  constructor(@Inject(MAT_DIALOG_DATA) public data: {fieldName: string},
              private fb: UntypedFormBuilder,
              private fieldService: FieldService,
              private logger: LoggingService) {
  }

  ngOnInit(): void {
    this.fieldName = this.data.fieldName
    this.isCreateMode = this.fieldName == null;
    this.logger.debug(`ID: ${this.fieldName} and CreateMode: ${this.isCreateMode}`)

    //TODO valided dates and improve HTML form.
    this.fieldForm = this.fb.group({
      name: ['', Validators.required],
      owner: ['', Validators.required],
      size: ['', Validators.required],
      cultivatedArea: ['', Validators.required],
      acquisitionDate: ['', Validators.required],
      ingenioId: ['', Validators.required],
      lastUpdated: ['', Validators.required, ],
    });

    if(this.isCreateMode) {
      this.title = "Create Field"
      this.fieldForm.controls['lastUpdated'].setValue(new Date())
    } else {
      this.title = "Edit Field"
      this.fieldForm.controls['name'].disable()
      this.fieldService.getField(this.fieldName)
        .pipe(first())
        .subscribe(x => this.fieldForm.patchValue(x!));
    }
    this.fieldForm.controls['lastUpdated'].disable()
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
    this.fieldService.update(this.fieldName, this.fieldForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.logger.info('Update successful')
          this.dialogRef.close()
        },
        error: error => {
          this.logger.error(error)
          this.errorMsg = (error.message) ? error.message : (error.status) ? `${error.status} - ${error.statusText}` : 'Server error';
          this.loading = false;
        }
      });
  }

  cancel() {
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
          this.errorMsg = (error.message) ? error.message : (error.status) ? `${error.status} - ${error.statusText}` : 'Server error';
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
