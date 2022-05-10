import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FieldService} from "../../field.service";
import {LoggingService} from "../../../logging/logging.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-delete-field-dialog',
  templateUrl: './delete-field-dialog.component.html',
  styleUrls: ['./delete-field-dialog.component.scss']
})
export class DeleteFieldDialogComponent {
  public confirmMessage!: string;
  public fieldId!: number;
  public errorMsg: string = "";

  constructor(public dialogRef: MatDialogRef<DeleteFieldDialogComponent>,
  private fieldService: FieldService,
  private logger: LoggingService) { }

  public delete() {
    this.fieldService.delete(this.fieldId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.logger.info('Delete successful')
          this.dialogRef.close()
        },
        error: error => {
          this.logger.error(error)
          this.errorMsg = (error.message) ? error.message : (error.status) ? `${error.status} - ${error.statusText}` : 'Server error';
        }
      });
  }

}
