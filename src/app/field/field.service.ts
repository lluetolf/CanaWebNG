import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Field} from "./field.model";
import {Observable} from "rxjs";
import {shareReplay} from "rxjs/operators";
import {LoggingService} from "../logging/logging.service";

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  fields$: Observable<Field[]>;

  constructor(private http: HttpClient, private logger: LoggingService) {
    const url = `${environment.apiBaseUri}/fields`
    this.logger.info("Call GET: " + url)
    this.fields$ = this.http.get<Field[]>(url).pipe(
      shareReplay(1)
    )
  }

  getFields(): Observable<Field[]>{
    return this.fields$
  }

}
