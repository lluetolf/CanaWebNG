import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {LoggingService} from "../../../logging/logging.service";
import {PayableService} from "../../payable.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-delete-payable-dialog',
  templateUrl: './delete-payable-dialog.component.html',
  styleUrls: ['./delete-payable-dialog.component.scss']
})
export class DeletePayableDialogComponent {
  public confirmMessage!: string;
  public payableId!: string;
  public errorMsg: string = "";

  constructor(public dialogRef: MatDialogRef<DeletePayableDialogComponent>,
              private payableService: PayableService,
              private logger: LoggingService) { }

  public delete() {
    this.payableService.delete(this.payableId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.logger.info('Delete successful')
          this.payableService.refreshData()
          this.dialogRef.close()
        },
        error: error => {
          this.logger.error(error)
          this.errorMsg = (error.message) ? error.message : (error.status) ? `${error.status} - ${error.statusText}` : 'Server error';
        }
      });
  }

}
