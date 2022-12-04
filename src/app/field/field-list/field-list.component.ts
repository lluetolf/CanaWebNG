import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {Field} from "../field.model";
import {FieldService} from "../field.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {EditFieldDialogComponent} from "./edit-field-dialog/edit-field-dialog.component";
import {DeleteFieldDialogComponent} from "./delete-field-dialog/delete-field-dialog.component";
import {LoggingService} from "../../logging/logging.service";

@Component({
  selector: 'app-field-list',
  templateUrl: './field-list.component.html',
  styleUrls: ['./field-list.component.scss']
})
export class FieldListComponent implements OnInit {
  columnsToDisplay = ['id', 'name', 'owner', 'size', 'cultivatedArea', 'acquisitionDate', 'ingenioId', 'operations'];
  footerColumnsToDisplay = ['creator'];
  dataSource = new MatTableDataSource<Field>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  public get isLoading$(): Observable<boolean> {
    return this.fieldService.isLoading$
  }

  constructor(
    private fieldService: FieldService,
    public modifyDialog: MatDialog,
    private logger: LoggingService) {
    this.logger.info("Init FieldListComponent")
    this.fieldService.data$.subscribe(fields => {
      this.dataSource.data = fields;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });}

  ngOnInit(): void {
    this.fieldService.refreshData()
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditField(fieldName: string) {
    this.openDialog(fieldName)
  }

  openCreateField() {
    this.openDialog(null)
  }

  openConfirmDelete(fieldName: string) {
    let dialogRef = this.modifyDialog.open(DeleteFieldDialogComponent, {
      width: '500px',
      disableClose: false
    });
    dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"
    dialogRef.componentInstance.fieldName = fieldName
  }


  private openDialog(fieldName: String | null) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "420px";
    dialogConfig.data = {
      fieldName
    };

    let dialogRef = this.modifyDialog.open(EditFieldDialogComponent, dialogConfig)
    dialogRef .afterClosed().subscribe(() =>  this.fieldService.refreshData(true))
  }

}
