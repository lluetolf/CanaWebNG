import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {Field} from "../field.model";
import {FieldService} from "../field.service";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {EditFieldDialogComponent} from "./edit-field-dialog/edit-field-dialog.component";
import {DeleteFieldDialogComponent} from "./delete-field-dialog/delete-field-dialog.component";

@Component({
  selector: 'app-field-list',
  templateUrl: './field-list.component.html',
  styleUrls: ['./field-list.component.scss']
})
export class FieldListComponent implements OnInit {
  allFields$!: Observable<Field[]>
  columnsToDisplay = ['id', 'name', 'ownerId', 'size', 'cultivatedArea', 'acquisitionDate', 'ingenioId', 'operations'];
  footerColumnsToDisplay = ['creater'];
  dataSource = new MatTableDataSource<Field>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private fieldService: FieldService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.allFields$ = this.fieldService.fields
    this.allFields$.subscribe(fields => {
      this.dataSource.data = fields;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEditField(id: number) {
    let dialogRef = this.dialog.open(EditFieldDialogComponent, {
      width: '500px',
      data: { 'fieldId': id},
    });
  }

  openCreateField() {
    let dialogRef = this.dialog.open(EditFieldDialogComponent, {
      width: '500px',
      data: {'fieldId': null},
    });
  }

  openConfirmDelete(id: number) {
    let dialogRef = this.dialog.open(DeleteFieldDialogComponent, {
      width: '500px',
      disableClose: false
    });
    dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"
    dialogRef.componentInstance.fieldId = id

  }


}
