import {OnInit} from '@angular/core';
import {OnDestroy} from '@angular/core';
import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject, zip} from 'rxjs';
import {map, takeUntil, tap} from 'rxjs/operators';
import {ReceivableService} from './receivable.service';
import {FieldService} from "../field/field.service";
import {ConsolidatedReceivable, Receivable} from "./receivable.model";
import {LoggingService} from "../logging/logging.service";

@Component({
  selector: 'app-receivable',
  templateUrl: './receivable.component.html',
  styleUrls: ['./receivable.component.scss']
})
export class ReceivableComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  harvests = Array.from({length: 4}, (_, i) => `${new Date().getFullYear() - i}-${new Date().getFullYear() - i + 1}`);
  harvestControl = new FormControl();
  private _receivables$ = zip(this.receivableService.data$, this.fieldService.data$).pipe(
    tap(() => this.logger.info("start")),
    map(([receivables, fields]) => {
      let res: ConsolidatedReceivable[] = []

      receivables.forEach(r => r.ingenioId = this.getIngenioId(r))
      fields.forEach( f => {
        let rs = receivables.filter(r => f.ingenioId.includes(r.ingenioId ? r.ingenioId : "UNKNOWN"))
        res.push(<ConsolidatedReceivable>{name: f.name, receivables: rs})
      })
      this.logger.info(receivables.length + " / " + fields.length)
      return res
    }),
    tap(() => this.logger.info("completed"))
  )

  public get receivables$() {
    return this._receivables$;
  }


  public get isLoading$() {
    return this.receivableService.isLoading$
  }

  constructor(private receivableService: ReceivableService,
              private fieldService: FieldService,
              private logger: LoggingService) {
  }

  ngOnInit(): void {
    this.harvestControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // this.receivableService.refreshData()
    });

    this.harvestControl.patchValue(this.harvests[0]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getIngenioId(r: Receivable) {
    return r.preliquidation?.ingenioId ?? r.liquidation?.ingenioId ?? r.ajuste?.ingenioId ?? "UNKNOWN";
  }
}
