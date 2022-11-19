import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LoggingService} from "../../../logging/logging.service";
import {PayableService} from "../../payable.service";
import {first, map, tap} from "rxjs/operators";
import {FieldService} from "../../../field/field.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-edit-payable-dialog',
  templateUrl: './edit-payable-dialog.component.html',
  styleUrls: ['./edit-payable-dialog.component.scss']
})
export class EditPayableDialogComponent implements OnInit {
  CATEGORIES!: string[]
  FIELDS!: string[]
  payableForm!: UntypedFormGroup;
  loading$ = new Subject<boolean>();
  title = "";

  private get isCreateMode(): boolean {
    return this.data.payableId == null;
  }

  errorMsg: string | undefined = undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { payableId: string },
              private fb: UntypedFormBuilder,
              private payableService: PayableService,
              private fieldService: FieldService,
              private logger: LoggingService,
              public dialogRef: MatDialogRef<EditPayableDialogComponent>) {
  }

  ngOnInit(): void {
    this.logger.debug(`ID: ${this.data.payableId} and CreateMode: ${this.isCreateMode}`)

    this.CATEGORIES = this.payableService.concepts;

    this.fieldService.data$.pipe(
      map(f => f.map(a => a.name)),
      tap(f => this.logger.info(f.join(", ")))
    ).subscribe(x => this.FIELDS = x)


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

    if (this.isCreateMode) {
      this.title = "Create Payable"
      this.payableForm.controls['lastUpdated'].setValue(new Date())
    } else {
      this.title = "Edit Payable"
      this.payableForm.controls['payableId'].disable()
      this.payableService.getPayable(this.data.payableId)
        .pipe(first())
        .subscribe(x => this.payableForm.patchValue(x!));
    }
    this.payableForm.controls['lastUpdated'].disable()

    this.loading$.subscribe( x => {
      if(x) {
        this.payableForm.disable()
      } else {
        this.payableForm.enable()
      }
    })
  }

  save() {
    if (this.payableForm.invalid) {
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
    this.payableService.create(this.payableForm.getRawValue())
      .pipe(first())
      .subscribe({
        next: f => {
          this.logger.info(`Created successful with id: ${f.payableId}`)
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
    this.payableService.update(this.data.payableId, this.payableForm.getRawValue())
      .pipe(first())
      .subscribe({
        next: f => {
          this.logger.info(`Update successful: ${f.payableId}`)
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
