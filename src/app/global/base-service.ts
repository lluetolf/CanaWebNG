import {BehaviorSubject, Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {delay, map, tap} from "rxjs/operators";
import {LoggingService} from "../logging/logging.service";

export abstract class BaseService<T> {
  readonly url: string;
  private _data$ = new BehaviorSubject<T[]>([]);
  public isLoading$ = new BehaviorSubject<boolean>(false);

  get data$(): BehaviorSubject<T[]> {
    return this._data$
  }

  set data$(data$: Observable<T[]>) {
    data$.subscribe(data => this._data$.next(data))
  }

  set data(data: T[]) {
    this._data$.next(data)
  }

  protected constructor(protected http: HttpClient,
                        protected logger: LoggingService,
                        url: string) {
    this.url = url
    this.refreshData()
  }

  public refreshData(reset: boolean = false) {
    let urlGetAll = this.url + "/all"
    this.logger.info("Fetching date from: " + urlGetAll)
    this.isLoading$.next(true)

    this.data$ = this.http.get<T[]>(urlGetAll, { headers: new HttpHeaders({"reset": String(reset) }) }).pipe(
      // delay(3000),
      map(
        (data: T[]) => {
          return data.map(d => {
            let dateFields = Object.keys(d).filter(x => x.includes("Date"))
            dateFields.forEach( (x) => {
              console.log("Convert: " + x);
              (d as any)[x] = this.createDateAsUTC((d as any)[x]);
            })
            return d
          });
        },
      ),
      tap(() => this.isLoading$.next(false))
    );
  }


  protected  createDateAsUTC(date: Date): Date {
    if(typeof date === 'string')
      date = new Date(date)
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
  }

  protected convertDateToUTC(date: Date): Date {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  }

  protected handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
