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

  // this isn't working properly, needs to sum up all the receivables for this field.
  getDescription(consReceivable: ConsolidatedReceivable): string {
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
      return "";
    }

    return `Pre MX$${preTotal.toLocaleString()} | Liq MX$${liqTotal.toLocaleString()} | Aju MX$${ajuTotal.toLocaleString()} | Total MX$${totalTotal.toLocaleString()}`
  }

}
