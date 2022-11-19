import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {FieldService} from "../../field.service";
import {first} from "rxjs/operators";
import {LoggingService} from "../../../logging/logging.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-edit-field-dialog',
  templateUrl: './edit-field-dialog.component.html',
  styleUrls: ['./edit-field-dialog.component.scss']
})
export class EditFieldDialogComponent implements OnInit {
  fieldForm!: UntypedFormGroup;
  loading$ = new Subject<boolean>();
  title = ""

  private get isCreateMode(): boolean {
    return this.data.fieldName == null;
  }

  errorMsg: string | undefined = undefined;


  constructor(@Inject(MAT_DIALOG_DATA) public data: { fieldName: string },
              private fb: UntypedFormBuilder,
              private fieldService: FieldService,
              private logger: LoggingService,
              public dialogRef: MatDialogRef<EditFieldDialogComponent>) {
  }

  ngOnInit(): void {
    this.logger.debug(`ID: ${this.data.fieldName} and CreateMode: ${this.isCreateMode}`)

    //TODO valided dates and improve HTML form.
    this.fieldForm = this.fb.group({
      name: ['', Validators.required],
      owner: ['', Validators.required],
      size: ['', Validators.required],
      cultivatedArea: ['', Validators.required],
      acquisitionDate: ['', Validators.required],
      ingenioId: ['', Validators.required],
      lastUpdated: ['', Validators.required],
    });

    if (this.isCreateMode) {
      this.title = "Create Field"
      this.fieldForm.controls['lastUpdated'].setValue(new Date())
    } else {
      this.title = "Edit Field"
      this.fieldForm.controls['name'].disable()
      this.fieldService.getField(this.data.fieldName)
        .pipe(first())
        .subscribe(x => this.fieldForm.patchValue(x!));
    }
    this.fieldForm.controls['lastUpdated'].disable()

    this.loading$.subscribe(x => {
        if (x) {
          this.fieldForm.disable()
        } else {
          this.fieldForm.enable()
        }
      }
    )
  }

  save() {
    if (this.fieldForm.invalid) {
      this.getFormValidationErrors()
      return;
    }

    this.loading$.next(true)
    if (this.isCreateMode)
      this.create();
    else
      this.update();
  }

  private create() {
    this.fieldService.create(this.fieldForm.getRawValue())
      .pipe(first())
      .subscribe({
        next: f => {
          this.logger.info(`Created successful with id:${f.id}`)
          this.dialogRef.close()
        },
        error: error => {
          this.logger.error(error)
          this.errorMsg = (error.message) ? error.message : (error.status) ? `${error.status} - ${error.statusText}` : 'Server error';
          this.loading$.next(false);
        },
        complete: () => {
          this.loading$.next(false);
        }
      });
  }

  private update() {
    this.fieldService.update(this.data.fieldName, this.fieldForm.getRawValue())
      .pipe(first())
      .subscribe({
        next: () => {
          this.logger.info('Update successful')
          this.dialogRef.close()
        },
        error: error => {
          this.logger.error(error)
          this.errorMsg = (error.message) ? error.message : (error.status) ? `${error.status} - ${error.statusText}` : 'Server error';
          this.loading$.next(false);
        },
        complete: () => {
          this.loading$.next(false);
        }
      });
  }

  cancel() {
    this.dialogRef.close()
  }


  private getFormValidationErrors() {
    Object.keys(this.fieldForm.controls).forEach(key => {
      const controlErrors = this.fieldForm.get(key)?.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          this.logger.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }
}
