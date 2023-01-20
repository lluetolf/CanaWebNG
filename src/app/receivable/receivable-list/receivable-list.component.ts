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

  constructor() { }

  getTitle(consReceivable: ConsolidatedReceivable): string {
    if (!consReceivable) {
      return "";
    }

    return consReceivable.name ?? "";
  }

  // this isn't working properly, needs to sum up all the receivables for this field.
  getDescription(consReceivable: ConsolidatedReceivable): string {
    let receivable = consReceivable.receivables[0]
    if (!receivable) {
      return "";
    }

    const preTotal = receivable.preliquidation?.total ?? "0";
    const liqTotal = receivable.liquidation?.total ?? "0";
    const ajuTotal = receivable.ajuste?.total ?? "0";

    return `MX$${preTotal} | MX$${liqTotal} | MX$${ajuTotal}`
  }

  private getFirstPhase(consReceivable: ConsolidatedReceivable): ReceivablePhase | undefined {
    let receivable = consReceivable.receivables[0]
    if (!receivable) {
      return undefined;
    }

    return receivable.preliquidation ?? receivable.liquidation ?? receivable.ajuste;
  }

}
