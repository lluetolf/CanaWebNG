import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LoggingService} from "../../../logging/logging.service";
import {PayableService} from "../../payable.service";
import {first, map, tap} from "rxjs/operators";
import {FieldService} from "../../../field/field.service";

@Component({
  selector: 'app-edit-payable-dialog',
  templateUrl: './edit-payable-dialog.component.html',
  styleUrls: ['./edit-payable-dialog.component.scss']
})
export class EditPayableDialogComponent implements OnInit {
  CATEGORIES!: string[]
  FIELDS!: string[]
  payableForm!: FormGroup;
  loading = false;
  title = "";
  public isCreateMode!: boolean;
  private payableId!: string;
  errorMsg: string | undefined = undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {payableId: string},
              private fb: FormBuilder,
              private payableService: PayableService,
              private fieldService: FieldService,
              private logger: LoggingService,
              public dialogRef: MatDialogRef<EditPayableDialogComponent>) {
  }

  ngOnInit(): void {
    this.CATEGORIES = this.payableService.concepts;

    this.fieldService.data$.pipe(
      map(f => f.map(a => a.name)),
      tap(f => this.logger.info(f.join(", ")))
    ).subscribe(x => this.FIELDS = x)

    this.payableId = this.data.payableId;

    this.isCreateMode = this.payableId == null;

    this.logger.debug(`ID: ${this.payableId} and CreateMode: ${this.isCreateMode}`)

    //TODO valided dates and improve HTML form.
    this.payableForm = this.fb.group({
      payableId: [''],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      pricePerUnit: ['', Validators.required],
      quantity: ['', Validators.required],
      transactionDate: ['', Validators.required],
      lastUpdated: ['', Validators.required],
      documentId: [''],
      fieldNames: [[]],
      comment: [''],
    });

    if(this.isCreateMode) {
      this.title = "Create Payable"
      this.payableForm.controls['lastUpdated'].setValue(new Date())
    } else {
      this.title = "Edit Payable"
      this.payableForm.controls['payableId'].disable()
      this.payableService.getPayable(this.payableId)
        .pipe(first())
        .subscribe(x => this.payableForm.patchValue(x!));
    }
    this.payableForm.controls['lastUpdated'].disable()
  }

  process() {
    if (this.payableForm.invalid) {
      this.getFormValidationErrors()
      return;
    }

    this.loading = true;
    if( this.isCreateMode)
      this.create();
    else
      this.update();
  }

  private create() {
    this.payableService.create(this.payableForm.value)
      .pipe(first())
      .subscribe({
        next: f => {
          this.logger.info(`Created successful with id:${f.payableId}`)
          this.payableService.refreshData(true)
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

  private update() {

  }

  private getFormValidationErrors() {
    Object.keys(this.payableForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.payableForm.get(key)!.errors!;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          this.logger.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }
}
