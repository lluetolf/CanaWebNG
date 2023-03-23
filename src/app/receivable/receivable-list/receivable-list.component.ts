import {Component, Input} from '@angular/core';
import {ConsolidatedReceivable, ReceivablePhase} from '../receivable.model';
import {Observable} from "rxjs";

@Component({
  selector: 'app-receivable-list',
  templateUrl: './receivable-list.component.html',
  styleUrls: ['./receivable-list.component.scss']
})
export class ReceivableListComponent {

  @Input()
  consolidatedReceivables$!: Observable<ConsolidatedReceivable[]>;



  constructor() {
  }

  getTitle(consReceivable: ConsolidatedReceivable): string {
    if (!consReceivable) {
      return "";
    }

    return consReceivable.name ?? "";
  }

  getTotals(consReceivable: ConsolidatedReceivable): number[] {
    let preTotal = 0;
    let liqTotal = 0;
    let ajuTotal = 0;
    consReceivable.receivables.forEach(r => {
      preTotal += r.preliquidation?.total ?? 0;
      liqTotal += r.liquidation?.total ?? 0;
      ajuTotal += r.ajuste?.total ?? 0;
    })
    let totalTotal = Math.round(preTotal + liqTotal + ajuTotal)

    if (consReceivable.receivables.length < 1) {
      return [];
    }

    return [preTotal, liqTotal, ajuTotal, totalTotal]
  }
}
