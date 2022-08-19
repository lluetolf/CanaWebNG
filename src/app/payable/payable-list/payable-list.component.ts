import {Component, OnInit, ViewChild} from '@angular/core';
import {Payable} from "../payable.model";
import {MatTableDataSource} from "@angular/material/table";
import {PayableService} from "../payable.service";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {LoggingService} from "../../logging/logging.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {EditPayableDialogComponent} from "./edit-payable-dialog/edit-payable-dialog.component";



interface MonthEntry {
  value: number;
  viewValue: string;
}



@Component({
  selector: 'app-payable-list',
  templateUrl: './payable-list.component.html',
  styleUrls: ['./payable-list.component.scss']
})
export class PayableListComponent implements OnInit {
  years: number[] = this.getYearList()
  months: MonthEntry[] = this.getMonthList();
  selectedMonth: number = (new Date()).getMonth();
  selectedYear: number = (new Date()).getFullYear();

  columnsToDisplay = ['category', 'subCategory', 'fieldNames', 'documentId', 'quantity', 'pricePerUnit', 'transactionDate', 'operations'];
  footerColumnsToDisplay = ['creater'];
  dataSource = new MatTableDataSource<Payable>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;


  constructor(private payableService: PayableService,
              public modifyDialog: MatDialog,
              private logger: LoggingService) {
    this.logger.info("Init PayableListComponent")
    this.payableService.data$.subscribe((payables) => {
      this.dataSource.data = payables;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit(): void {
    this.payableService.getDataForMonth(this.selectedYear, this.selectedMonth)
  }


  getMonthList (locale = "en"): MonthEntry[] {
    let list: MonthEntry[] = [];
    for (let i = 0; i <= 11 ; i++) {
      list.push({ "value": i, "viewValue": Intl.DateTimeFormat(locale, { "month": "long" }).format(new Date(0, i)) })
    }
    return list
  }

  getYearList (): number[] {
    let list: number[] = [];
    for (let i = 2018; i <= (new Date()).getFullYear(); i++) {
      list.push(i)
    }
    return list
  }

  openEditPayable(payableId: string) {
    this.openDialog(payableId)
  }

  openCreatePayable() {
    this.openDialog(null)
  }

  openConfirmDelete(payableId: string) {

  }

  //
  //
  private openDialog(payableId: String | null) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.data = {
      payableId: payableId
    };

    let dialogRef = this.modifyDialog.open(EditPayableDialogComponent, dialogConfig)
    dialogRef .afterClosed().subscribe(() =>  this.updatePayableList() )
  }

  public updatePayableList() {
    this.payableService.getDataForMonth(this.selectedYear, this.selectedMonth, true)
  }
}
