import { Component, OnInit } from '@angular/core';
import {FieldService} from "./field.service";
import {Observable} from "rxjs";
import {Field} from "./field.model";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {
  allFields$!: Observable<Field[]>

  constructor(private fieldService: FieldService) { }

  ngOnInit(): void {
    this.allFields$ = this.fieldService.getFields()
  }

}
