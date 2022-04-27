import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Field} from "./field.model";
import {EMPTY, Observable} from "rxjs";
import {filter, first, shareReplay, map} from "rxjs/operators";
import {LoggingService} from "../logging/logging.service";

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  fields$!: Observable<Field[]>;
  fetchedFieldTS!: Date;

  constructor(private http: HttpClient, private logger: LoggingService) {
    this.fetchFields()
  }

  // Create a new Observable
  private fetchFields() {
    const url = `${environment.apiBaseUri}/field`
    const ts = new Date()
    this.logger.info("Call GET: " + url + " @ " + ts)
    this.fetchedFieldTS = ts

    this.fields$ = this.http.get<Field[]>(url).pipe(
      shareReplay(1)
    )
  }

  getFields(): Observable<Field[]>{
    const ts = new Date()

    //use cache if less than 1min
    const diff = ts.getTime() - this.fetchedFieldTS.getTime()
    if( diff > 60 * 1000) {
      this.logger.info("Refresh cache, diff: " + diff)
      this.fetchFields()
    }
    return this.fields$
  }

  getField(id: number): Observable<Field | null> {
    return this.fields$.pipe(
      map(
      fields => {
        let selected = fields.filter(f => f.id == id);
        return (selected.length > 0) ? selected[0] : null;
      })
    )
  }

  update(id: number, params: any) {
    const url = `${environment.apiBaseUri}/fields/${id}`
    return this.http.put(url, params);
  }

  create(params: any): Observable<Field> {
    const url = `${environment.apiBaseUri}/fields`
    return this.http.post<Field>(url, params);

  }
}
