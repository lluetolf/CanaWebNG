import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from '../../environments/environment';
import {Field} from "./field.model";
import {Observable} from "rxjs";
import {map, catchError} from "rxjs/operators";
import {LoggingService} from "../logging/logging.service";
import {BaseService} from "../global/base-service";

@Injectable({
  providedIn: 'root'
})
export class FieldService extends BaseService<Field> {

  constructor(http: HttpClient,
              logger: LoggingService) {
    super(http, logger, `${environment.apiBaseUri}/field`)
  }

  getField(name: string): Observable<Field | undefined> {
    return this.data$!.pipe(
      map(fields => fields.find(f => f.name === name)),
      catchError(this.handleError)
    )
  }

  update(name: string, field: Field) {
    const url = `${this.url}?fieldName=${name}`
    field.acquisitionDate = this.createDateAsUTC(field.acquisitionDate)

    this.logger.info("Updating Field with name: " + name)
    return this.http.put(url, field).pipe(
      map(x => {
        return x
      }),
      catchError(this.handleError)
    )
  }

  create(params: any): Observable<Field> {
    return this.http.post<Field>(this.url, params).pipe(
      catchError(this.handleError)
    )
  }

  delete(fieldName: string): Observable<boolean> {
    const url = `${this.url}/name/${fieldName}`
    this.logger.info("Delete Field: " + fieldName)
    return this.http.delete(url).pipe(
      map(() => true),
      catchError(this.handleError)
    )

  }
}
