import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {BaseService} from '../global/base-service';
import {LoggingService} from '../logging/logging.service';
import {ConsolidatedReceivable, Receivable} from './receivable.model';
import {BehaviorSubject, zip} from "rxjs";
import {map} from "rxjs/operators";
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
      map(([receivables, fields]) => {
        let res: ConsolidatedReceivable[] = []

        receivables
          .filter(r => r.harvest == harvest)
          .forEach(r => r.ingenioId = this.getIngenioId(r))

        fields.forEach(f => {
          let ingenioIds = f.ingenioId.map(f2 => f2.ingenioId)
          let rs = receivables.filter(r => ingenioIds.includes(r.ingenioId ? r.ingenioId : "UNKNOWN"))
          res.push(<ConsolidatedReceivable>{name: f.name, receivables: rs})
        })
        this.logger.info(receivables.length + " / " + fields.length)
        return res
      })
    ).subscribe(
      res => {
        this.consolidatedReceivables$.next(res)
        this.isLoading$.next(false)
      }
    )
  }

  private getIngenioId(r: Receivable) {
    return r.preliquidation?.ingenioId ?? r.liquidation?.ingenioId ?? r.ajuste?.ingenioId ?? "UNKNOWN";
  }

}
