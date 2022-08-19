import { Injectable } from '@angular/core';
import {Payable} from "./payable.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LoggingService} from "../logging/logging.service";
import {environment} from "../../environments/environment";
import {catchError, map, tap} from "rxjs/operators";
import {BaseService} from "../global/base-service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PayableService extends BaseService<Payable> {

  readonly concepts = ["AGROQUIMICOS", "COMIDA", "COSECHA", "FERTILIANTES", "GASOLINA", "MANO DE OBRA"]

  constructor(http: HttpClient,
    logger: LoggingService) {
    super(http, logger, `${environment.apiBaseUri}/payable`)
  }

  getDataForMonth(year: number, month: number) {
    let urlGetAll = this.url + `/month?year=${year}&month=${month+1}`;
    this.logger.info("Fetching date from: " + urlGetAll);

    let payables$ = this.http.get<Payable[]>(urlGetAll, { headers: new HttpHeaders({"reset": String(false) }) }).pipe(
      map(
        (data: Payable[]) => {
          return data.map(d => {
            let dateFields = Object.keys(d).filter(x => x.includes("Date"))
            dateFields.forEach( (x) => {
              console.log("Covnert: " + x);
              (d as any)[x] = this.createDateAsUTC((d as any)[x]);
            })
            return d
          });
        },
      )
    );
    this.data$ = payables$
  }

  getPayable(payableId: string): Observable<Payable | null> {
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
    let r = this.http.post<Payable>(this.url, params)
      .pipe(
        catchError(this.handleError),
      )

    return r
  }

  update(payableId: string, payable: Payable): Observable<Payable> {
    const url = `${this.url}this.url?payableId=${payableId}`
    let r = this.http.put<Payable>(url, payable)
      .pipe(
        catchError(this.handleError),
      )

    return r
  }
}
