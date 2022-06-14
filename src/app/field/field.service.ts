import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from '../../environments/environment';
import {Field} from "./field.model";
import {BehaviorSubject, EMPTY, Observable, of} from "rxjs";
import {filter, first, shareReplay, map, tap, retry, catchError} from "rxjs/operators";
import {LoggingService} from "../logging/logging.service";

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  private _fields$ = new BehaviorSubject<Field[]>([]);
  readonly concepts = ["AGROQUIMICOS", "COMIDA", "COSECHA", "FERTILIANTES", "GASOLINA", "MANO DE OBRA"]

  public get fields(): Observable<Field[]> {
    return this._fields$.asObservable()
  }

  private set fields(fields$) {
    fields$.subscribe(fields => this._fields$.next(fields))
  }


  constructor(private http: HttpClient,
              private logger: LoggingService) {
  }

  refreshFields(reset: boolean = false) {
    const url = `${environment.apiBaseUri}/fields`
    this.logger.info("Fetching date from: " + url)
    let fields$ = this.http.get<Field[]>(url, { headers: new HttpHeaders({"reset": String(reset) }) }).pipe(
      map(
          (fields: Field[]) => fields.map(field => { field.acquisitionDate = this.createDateAsUTC(field.acquisitionDate); return field}),
        )
      );
    this.fields = fields$
  }

  getField(id: number): Observable<Field | null> {
    return this.fields!.pipe(
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

    this.logger.info("Updating Field with id: " + id)
    return this.http.put(url, field).pipe(
      map(x => {
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
        return true;}),
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
