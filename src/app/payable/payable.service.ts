import {Injectable} from '@angular/core';
import {Payable} from "./payable.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoggingService} from "../logging/logging.service";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {BaseService} from "../global/base-service";
import {Observable} from "rxjs";

interface MonthTotal {
  year: number;
  month: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PayableService extends BaseService<Payable> {

  readonly concepts = ["AGROQUIMICOS", "COMIDA", "COSECHA", "FERTILIZANTES", "GASOLINA", "MANO DE OBRA"]

  constructor(http: HttpClient,
    logger: LoggingService) {
    super(http, logger, `${environment.apiBaseUri}/payable`)
  }

  getDataForMonth(year: number, month: number, reset = false) {
    let urlGetAll = this.url + `/month?year=${year}&month=${month+1}`;
    this.logger.info("Get data for: " + urlGetAll);
    this.isLoading$.next(true)

    let payables$ = this.http.get<Payable[]>(urlGetAll,
      { headers: new HttpHeaders({"reset": String(reset) }) }).pipe(
      map(
        (data: Payable[]) => {
          return data.map(d => {
            let dateFields = Object.keys(d).filter(x => x.includes("Date"))
            dateFields.forEach( (x) => {
              console.log("Convert: " + x);
              (d as any)[x] = this.createDateAsUTC((d as any)[x]);
            })
            return d
          });
        },
      )
    );
    payables$.subscribe(x => {
      this.data$.next(x)
      this.isLoading$.next(false)
    })
    this.data$ = payables$
  }

  getPayable(payableId: string): Observable<Payable | null> {
    this.logger.info("Get payable: " + payableId)

    return this.data$!.pipe(
      map(
        payables => {
          let selected = payables.filter(f => f.payableId === payableId);
          if(selected.length > 0) {
            var s: Payable = selected[0]
            s.transactionDate = this.createDateAsUTC(s.transactionDate)
            return s
          }
          return null;
        })
    )
  }

  create(params: any): Observable<Payable> {
    return this.http.post<Payable>(this.url, params)
      .pipe(
        catchError(this.handleError),
      )
  }

  update(payableId: string, payable: Payable): Observable<Payable> {
    const url = `${this.url}?payableId=${payableId}`
    this.logger.info("Update payable: " + payableId)

    return this.http.put<Payable>(url, payable)
      .pipe(
        catchError(this.handleError),
      )
  }

  delete(payableId: string) : Observable<boolean> {
    const url = `${this.url}/${payableId}`
    this.logger.info("Delete payable: " + payableId)

    return this.http.delete(url).pipe(
      map(() => { return true; }),
      catchError( this.handleError)
    )
  }

  getTotalPerMonth(): Observable<MonthTotal> {
    const url = `${this.url}/monthlytotals`
    this.logger.info("getTotalPerMonth")

    return this.http.get<MonthTotal>(url);
  }
}
