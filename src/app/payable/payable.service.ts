import {Injectable} from '@angular/core';
import {Payable} from "./payable.model";
import {HttpClient} from "@angular/common/http";
import {LoggingService} from "../logging/logging.service";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {BaseService} from "../global/base-service";
import {BehaviorSubject, Observable} from "rxjs";

interface MonthTotal {
  year: number;
  month: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PayableService extends BaseService<Payable> {

  readonly concepts = ["AGROQUIMICOS", "COMIDA", "COSECHA", "FERTILIZANTES", "GASOLINA", "MANO DE OBRA", "INTERESES POR FINANCIAMIENTO"]

  private _selectedPayables$ = new BehaviorSubject<Payable[]>([]);

  get selectedPayables$(): BehaviorSubject<Payable[]> {
    return this._selectedPayables$
  }

  constructor(http: HttpClient,
              logger: LoggingService) {
    super(http, logger, `${environment.apiBaseUri}/payable`)
  }

  getDataForMonth(year: number, month: number) {
    this.isLoading$.next(true)

    this.data$.pipe(
      map(d => d.filter(v => {
        return v.transactionDate.getMonth() === month && v.transactionDate.getFullYear() === year
      })),
      catchError(this.handleError)
    ).subscribe(x => {
      this._selectedPayables$.next(x)
      this.isLoading$.next(false)
    })
  }

  getPayable(payableId: string): Observable<Payable | undefined> {
    this.logger.info("Get payable: " + payableId)

    return super.data$!.pipe(
      map(payables => payables.find(f => f.payableId === payableId)),
      catchError(this.handleError)
    )
  }

  create(params: any): Observable<Payable> {
    return this.http.post<Payable>(this.url, params).pipe(
      catchError(this.handleError),
    )
  }

  update(payableId: string, payable: Payable): Observable<Payable> {
    const url = `${this.url}?payableId=${payableId}`
    this.logger.info("Update payable: " + payableId)

    return this.http.put<Payable>(url, payable).pipe(
      catchError(this.handleError),
    )
  }

  delete(payableId: string): Observable<boolean> {
    const url = `${this.url}/${payableId}`
    this.logger.info("Delete payable: " + payableId)

    return this.http.delete(url).pipe(
      map(() => true),
      catchError(this.handleError)
    )
  }
}
