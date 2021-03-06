import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Field } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class FieldsService {
  private serviceURL = environment.apiBaseUri + 'field';
  readonly  allFieldsInMemory: Field[] = [];

  constructor(
    private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /* Get all Fields from the server */
  getFields(): Observable<Field[]> {
    this.log('Check cache for fields');
    if (this.allFieldsInMemory.length > 0) {
      this.log('Returning results from cache.');
      return of(this.allFieldsInMemory);
    } else {
      return this.getFieldsFromServer();
    }
  }


  /* Get all Fields from the server */
  getFieldsFromServer(): Observable<Field[]> {
    this.log('Fetching all fields.');
    return this.http.get<Field[]>(this.serviceURL)
      .pipe(
        map(fields => {
          fields.forEach(f => {
            f.acquisitionDate = new Date(f.acquisitionDate + 'Z');
            f.lastUpdated = new Date(f.lastUpdated + 'Z');
          });
          this.allFieldsInMemory.push(...fields);
          return fields; }),
        tap(_ => this.log('fetched all fields')),
        catchError(this.handleError<Field[]>('getFields', []))
      );
  }

  /** GET field by name. Return `undefined` when name not found */
  getFieldByName<Data>(name: string): Observable<Field> {
    const url = `${this.serviceURL}/${name}`;

    return this.http.get<Field>(url)
      .pipe(
        map(f => {
            f.acquisitionDate = new Date(f.acquisitionDate + 'Z');
            f.lastUpdated = new Date(f.lastUpdated + 'Z');
            return f; }),
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} field name=${name}`);
        }),
        catchError(this.handleError<Field>(`getField name=${name}`))
      );
  }

  /** PUT: update the field on the server */
  updateField(field: Field): Observable<any> {
    return this.http.patch(this.serviceURL, field, this.httpOptions).pipe(
      tap(_ => this.log(`updated field name=${field.name}`)),
      catchError(this.handleError<any>('updateField'))
    );
  }


  /** POST: add a new field to the server */
  addField(field: Field): Observable<Field> {
    // hack, we are only interested in the date, so setting it to 12 to avoid timezone problems
    field.acquisitionDate.setHours(12);
    return this.http.post<Field>(this.serviceURL, field, this.httpOptions)
    .pipe(
      tap((newField: Field) => {
        this.log(`added field w/ name=${newField.name}`);
        this.allFieldsInMemory.push(newField);
      }),
      catchError(this.handleError<Field>('addField'))
    );
  }

  /** DELETE: delete the field from the server */
  deleteField(fieldId: string): Observable<Field> {
    const url = `${this.serviceURL}/${fieldId}`;

    return this.http.delete<Field>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted field id=${fieldId}`)),
      catchError(this.handleError<Field>('deleteField'))
    );
  }

  private log(message: string) {
    console.log(`FieldsService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
