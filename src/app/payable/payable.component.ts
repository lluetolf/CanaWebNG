import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Field} from "../field/field.model";
import {MatTableDataSource} from "@angular/material/table";
import {Payable} from "./payable.model";
import {PayableService} from "./payable.service";

@Component({
  selector: 'app-payable',
  templateUrl: './payable.component.html',
  styleUrls: ['./payable.component.scss']
})
export class PayableComponent implements OnInit {
  allPayables$!: Observable<Payable[]>
  columnsToDisplay = ['id', 'name', 'ownerId', 'size', 'cultivatedArea', 'acquisitionDate', 'ingenioId', 'operations'];
  footerColumnsToDisplay = ['creater'];
  dataSource = new MatTableDataSource<Payable>();

  private startDate: Date = new Date('2022-05-02')
  private endDate: Date = new Date('2022-05-09')
  public listOfDays: Date[] = [
    new Date(this.startDate.getTime() + 0*(1000 * 60 * 60 * 24)),
    new Date(this.startDate.getTime() + 1*(1000 * 60 * 60 * 24)),
    new Date(this.startDate.getTime() + 2*(1000 * 60 * 60 * 24)),
    new Date(this.startDate.getTime() + 3*(1000 * 60 * 60 * 24)),
    new Date(this.startDate.getTime() + 4*(1000 * 60 * 60 * 24)),
    new Date(this.startDate.getTime() + 5*(1000 * 60 * 60 * 24)),
    new Date(this.startDate.getTime() + 6*(1000 * 60 * 60 * 24)),
  ]

  constructor(private payableService: PayableService) { }

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
