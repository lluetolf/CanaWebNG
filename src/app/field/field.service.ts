import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from '../../environments/environment';
import {Field} from "./field.model";
import {BehaviorSubject, EMPTY, Observable} from "rxjs";
import {filter, first, shareReplay, map, tap, retry, catchError} from "rxjs/operators";
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

    this.http.get<Field[]>(url).pipe(
      map(
        (fields: Field[]) => fields.map(field => { field.acquisitionDate = this.createDateAsUTC(field.acquisitionDate); return field})
      )
    ).subscribe( list => {
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
        if(selected.length > 0) {
          var s: Field = selected[0]
          s.acquisitionDate = this.createDateAsUTC(s.acquisitionDate)
          return s
        }
        return null;
      })
    )
  }

  update(id: number, field: Field) {
    const url = `${environment.apiBaseUri}/fields/${id}`
    field.id = id;
    field.acquisitionDate = this.createDateAsUTC(field.acquisitionDate)
    let fieldToUpdateIndex = this.fields.findIndex(f => f.id == field.id);

    this.fields$.next(this.fields)
    return this.http.put(url, field).pipe(
      map(x => {
        this.fields[fieldToUpdateIndex] = field;
        this.fields$.next(this.fields);
        return x;
      })
    )
  }

  create(params: any): Observable<Field> {
    const url = `${environment.apiBaseUri}/fields`
    return this.http.post<Field>(url, params);
  }

  delete(id: number): Observable<boolean> {
    const url = `${environment.apiBaseUri}/fields/${id}`
    this.logger.info("Delete Field: " + id)
    return this.http.delete(url).pipe(
      map(x => {
        this.fields = this.fields.filter(f => f.id !== id)
        this.fields$.next(this.fields);
        return true}),
      catchError( err => {return Observable.throw(false)})
    )

  }

  private  createDateAsUTC(date: Date): Date {
    if(typeof date === 'string')
      date = new Date(date)
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
  }

  private convertDateToUTC(date: Date): Date {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  }
}
