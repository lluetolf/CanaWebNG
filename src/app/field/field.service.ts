import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from '../../environments/environment';
import {Field} from "./field.model";
import {BehaviorSubject, EMPTY, Observable} from "rxjs";
import {filter, first, shareReplay, map, tap} from "rxjs/operators";
import {LoggingService} from "../logging/logging.service";

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  private fields!: Field[];
  fields$ = new BehaviorSubject<Field[]>([]);
  fetchedFieldTS!: Date;

  constructor(private http: HttpClient, private logger: LoggingService) {
    this.fetchFields()
  }

  // Create a new Observable
  private fetchFields() {
    const url = `${environment.apiBaseUri}/fields`
    const ts = new Date()
    this.logger.info("Call GET: " + url + " @ " + ts)
    this.fetchedFieldTS = ts

    this.http.get<Field[]>(url).subscribe( list => {
        this.fields = list;
        this.fields$.next(this.fields);
      });
  }

  getFields(): Observable<Field[]>{
    const ts = new Date()

    //use cache if less than 1min
    const diff = ts.getTime() - this.fetchedFieldTS.getTime()
    if( diff > 60 * 1000) {
      this.logger.info("Refresh cache, diff: " + diff)
      this.fetchFields()
    }
    return this.fields$.asObservable()
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

  update(id: number, field: Field) {
    const url = `${environment.apiBaseUri}/fields/${id}`
    field.id = id;
    let fieldToUpdateIndex = this.fields.findIndex(f => f.id == field.id);
    this.fields[fieldToUpdateIndex] = field;
    this.fields$.next(this.fields)
    return this.http.put(url, field);
  }

  create(params: any): Observable<Field> {
    const url = `${environment.apiBaseUri}/fields`
    return this.http.post<Field>(url, params);

  }
}
