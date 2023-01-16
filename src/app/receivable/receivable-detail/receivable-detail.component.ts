import { Component, Input } from '@angular/core';
import { Receivable, ReceivablePhase } from '../receivable.model';

enum ReceivablePhaseType {
  Pre = "Preliquidation",
  Liq = "Liquidation",
  Aju = "Ajuste"
}

type DataSourceModel = { phase: ReceivablePhaseType } & ReceivablePhase;

@Component({
  selector: 'app-receivable-detail',
  templateUrl: './receivable-detail.component.html',
  styleUrls: ['./receivable-detail.component.scss']
})
export class ReceivableDetailComponent {

  ingenioId: string = "UNKNOWN"

  @Input()
  set receivable (value: Receivable | undefined) {
    if (value) {
      this.setDataSource(value);
      this.ingenioId = value.ingenioId ? value.ingenioId: "ID NOT SET";
    }
  }

  displayedColumns = ["phase", "pricePerUnit", "tons", "total"]

  dataSource: DataSourceModel[] = [];
  checkSuccess = false;

  constructor() { }

  private setDataSource(value: Receivable): void {
    const models: DataSourceModel[] = [];

    if (value.preliquidation) {
      models.push({
        phase: ReceivablePhaseType.Pre,
        ...value.preliquidation
      })
    }

    if (value.liquidation) {
      models.push({
        phase: ReceivablePhaseType.Liq,
        ...value.liquidation
      })
    }

    if (value.ajuste) {
      models.push({
        phase: ReceivablePhaseType.Aju,
        ...value.ajuste
      })
    }

    this.checkSuccess = this.validate(value);
    this.dataSource = models;
  }

  /* TODO: improve check to succeed on rounded value errors */
  private validate(value: Receivable): boolean {
    const preLiqTons = this.getRoundedValue(value.preliquidation?.tons);
    const liqTons = this.getRoundedValue(value.liquidation?.tons);
    const ajusTons = this.getRoundedValue(value.ajuste?.tons);

    if (!value.preliquidation) {
      if (!value.liquidation) {
        return false;
      }
      if (!value.ajuste) {
        return true;
      }

      return liqTons == ajusTons || liqTons / 0.2 == ajusTons;
    } else {
      if (!value.preliquidation || !value.ajuste) {
        return true;
      }

      return preLiqTons + liqTons == ajusTons;
    }
  }

  private getRoundedValue(value: number | undefined): number {
    if (!value) {
      value = 0;
    }

    return Math.round(value);
  }
}
