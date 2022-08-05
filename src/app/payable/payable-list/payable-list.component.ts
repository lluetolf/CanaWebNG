import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {Payable} from "../payable.model";
import {MatTableDataSource} from "@angular/material/table";
import {PayableService} from "../payable.service";
import {MatDialog} from "@angular/material/dialog";
import {LoggingService} from "../../logging/logging.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";



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

  allPayables$!: Observable<Payable[]>
  columnsToDisplay = ['category', 'subCategory', 'fieldNames', 'documentId', 'quantity', 'pricePerUnit', 'transactionDate', 'operations'];
  footerColumnsToDisplay = ['creater'];
  dataSource = new MatTableDataSource<Payable>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private payableService: PayableService,
              public dialog: MatDialog,
              private logger: LoggingService) {
  }

  ngOnInit(): void {
    this.logger.info("Init PayableListComponent")
    this.allPayables$ = this.payableService.data$
    this.allPayables$.subscribe(payables => {
      this.dataSource.data = payables;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.payableService.getDataForMonth(this.selectedYear, this.selectedMonth)
  }

  step = 0;


  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
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

  openEditPayable(name: string) {

  }

  openConfirmDelete(name: string) {

  }

  openCreatePayable() {

  }

  updatePayableList() {
    this.logger.info("Value")
    this.payableService.getDataForMonth(this.selectedYear, this.selectedMonth)
  }
}
