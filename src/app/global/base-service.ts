import {BehaviorSubject, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {map, mergeMap, shareReplay, tap} from "rxjs/operators";
import {LoggingService} from "../logging/logging.service";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService<T extends Object> {
  /**
   * Base class for all DB Entities.
   * _data$ loads the entire data and scoping should be done in the child class.
   *
   */
  private _refreshTrigger$ = new BehaviorSubject<void>(undefined);
  public isLoading$ = new BehaviorSubject<boolean>(false);

  private readonly apiRequest$ =
    this.http.get<T[]>(this.url + "/all", {headers: new HttpHeaders({"reset": String(true)})}).pipe(
      map(
        (data: T[]) => {
          return data.map(d => {
            let dateFields = Object.keys(d).filter(x => x.includes("Date"))
            dateFields.forEach((x) => {
              (d as any)[x] = this.createDateAsUTC((d as any)[x]);
            })
            return d
          });
        },
      ),
      tap(() => this.isLoading$.next(false))
    )

  public readonly data$ = this._refreshTrigger$.pipe(
    mergeMap(() => this.apiRequest$),
    shareReplay(1)
  );

  protected constructor(protected http: HttpClient,
                        protected logger: LoggingService,
                        protected url: string) {
  }

  public refreshData() {
    this.logger.info("Refresh data.")
    this._refreshTrigger$.next()
  }


  protected createDateAsUTC(date: Date | string): Date {
    if (typeof date === 'string')
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
