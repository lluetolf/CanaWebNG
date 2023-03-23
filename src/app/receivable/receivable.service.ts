import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {BaseService} from '../global/base-service';
import {LoggingService} from '../logging/logging.service';
import {ConsolidatedReceivable, Receivable} from './receivable.model';
import {BehaviorSubject, zip} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import {FieldService} from "../field/field.service";


@Injectable({
  providedIn: 'root'
})
export class ReceivableService extends BaseService<Receivable> {

  private _consolidatedReceivables$ = new BehaviorSubject<ConsolidatedReceivable[]>([]);
  get consolidatedReceivables$(): BehaviorSubject<ConsolidatedReceivable[]> {
    return this._consolidatedReceivables$;
  }

  constructor(http: HttpClient,
              private fieldService: FieldService,
              logger: LoggingService) {
    super(http, logger, `${environment.apiBaseUri}/receivable`)
  }

  getDataForHarvest(harvest: string) {
    this.isLoading$.next(true)

    zip(this.data$, this.fieldService.data$).pipe(
      tap(() => this.logger.info("start the zipping")),
      map(([receivables, fields]) => {
        let res: ConsolidatedReceivable[] = []

        let selectedReceivables: Receivable[] = receivables.filter(r => r.harvest == harvest)
        selectedReceivables.forEach(r => r.ingenioId = this.getIngenioId(r))

        try {
          fields.filter(x => x.ingenioId)
            .forEach(f => {
              let ingenioIds = f.ingenioId.map(f2 => f2.ingenioId)
              let rs = selectedReceivables.filter(r => ingenioIds.includes(r.ingenioId ? r.ingenioId : "UNKNOWN"))
              res.push(<ConsolidatedReceivable>{name: f.name, receivables: rs})
            })
        } catch (e) {
          this.logger.error("Failed matching fields and ingenioids: " + e)
        }
        this.logger.info("R: " + selectedReceivables.length + " / " + receivables.length + ", F: " + fields.length)
        return res
      }),
      catchError(this.handleError)
    ).subscribe(
      res => {
        this._consolidatedReceivables$.next(res)
        this.isLoading$.next(false)
    }
    )
  }

  public updateDeductions(ingenioId: string, harvest: string, phase: string, amount: number) {
    const receivableId = `${ingenioId}_${harvest}`
    const url = `${this.url}`
    const options = {params: new HttpParams().set('receivableId', receivableId).set('phase', phase.toLowerCase()).set('amount', amount)};
    return this.http.put(url, {}, options)
  }

  private getIngenioId(r: Receivable) {
    return r.preliquidation?.ingenioId ?? r.liquidation?.ingenioId ?? r.ajuste?.ingenioId ?? "UNKNOWN";
  }

}
