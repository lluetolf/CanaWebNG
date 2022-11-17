import { Component, Input } from '@angular/core';
import { Receivable, ReceivablePhase } from '../receivable.model';

@Component({
  selector: 'app-receivable-list',
  templateUrl: './receivable-list.component.html',
  styleUrls: ['./receivable-list.component.scss']
})
export class ReceivableListComponent {

  @Input()
  receivables: Receivable[] | null = [];

  constructor() { }

  getTitle(receivable: Receivable): string {
    if (!receivable) {
      return "";
    }

    return this.getFirstPhase(receivable)?.ingenioId ?? "";    
  }

  getDescription(receivable: Receivable): string {
    if (!receivable) {
      return "";
    }

    const preTotal = receivable.preliquidation?.total ?? "0";
    const liqTotal = receivable.liquidation?.total ?? "0";
    const ajuTotal = receivable.ajuste?.total ?? "0";

    return `MX$${preTotal} | MX$${liqTotal} | MX$${ajuTotal}`
  }

  private getFirstPhase(receivable: Receivable): ReceivablePhase | undefined {
    if (!receivable) {
      return undefined;
    }

    return receivable.preliquidation ?? receivable.liquidation ?? receivable.ajuste;
  }

}
