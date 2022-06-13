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
export class PayableComponent {
  constructor() {
  }
}
