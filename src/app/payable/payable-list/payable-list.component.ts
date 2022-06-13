import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Payable} from "../payable.model";
import {MatTableDataSource} from "@angular/material/table";
import {PayableService} from "../payable.service";

@Component({
  selector: 'app-payable-list',
  templateUrl: './payable-list.component.html',
  styleUrls: ['./payable-list.component.scss']
})
export class PayableListComponent implements OnInit {

  allPayables$!: Observable<Payable[]>
  columnsToDisplay = ['id', 'name', 'ownerId', 'size', 'cultivatedArea', 'acquisitionDate', 'ingenioId', 'operations'];
  footerColumnsToDisplay = ['creater'];
  dataSource = new MatTableDataSource<Payable>();

  private startDate: Date = new Date('2022-05-02')
  private endDate: Date = new Date('2022-05-09')
  public listOfDays: Date[] = []

  constructor(private payableService: PayableService) {
  }

  ngOnInit(): void {
    this.allPayables$ = this.payableService.getAllPayables()
    this.allPayables$.subscribe(payables => {
      this.dataSource.data = payables;
    });
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
}
