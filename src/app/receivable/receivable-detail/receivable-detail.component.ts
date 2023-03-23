import { Component, Input } from '@angular/core';
import { Receivable, ReceivablePhase } from '../receivable.model';
import {AbstractControl, FormControl} from "@angular/forms";
import {ReceivableService} from "../receivable.service";

enum ReceivablePhaseType {
  Pre = "Preliquidation",
  Liq = "Liquidation",
  Aju = "Ajuste"
}

type DataSourceModel = { phase: ReceivablePhaseType, deductionControl: AbstractControl, harvest: string } & ReceivablePhase;

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

  displayedColumns = ["phase", "pricePerUnit", "tons", "total1", "deductions", "total2"]

  dataSource: DataSourceModel[] = [];
  checkSuccess = false;

  constructor(private receivableService: ReceivableService) { }

  onToggleChange(checked: boolean, model: DataSourceModel): void {
    const newValue = model.deductionControl.value ?? 0;
    if (checked && newValue != model.deductible) {
      this.receivableService.updateDeductions(model.ingenioId ?? "", model.harvest, model.phase, model.deductionControl.value ?? 0).subscribe(res => {
        model.deductible = model.deductionControl.value ?? 0;
      })
    }
  }

  private setDataSource(value: Receivable): void {
    const models: DataSourceModel[] = [];

    if (value.preliquidation) {
      models.push({
        phase: ReceivablePhaseType.Pre,
        harvest: value.harvest ?? "UNKNOWN",
        ...value.preliquidation,
        deductionControl: new FormControl(value.preliquidation.deductible ?? 0 ),
      })
    }

    if (value.liquidation) {
      models.push({
        phase: ReceivablePhaseType.Liq,
        harvest: value.harvest ?? "UNKNOWN",
        ...value.liquidation,
        deductionControl: new FormControl(value.liquidation.deductible ?? 0 ),
      })
    }

    if (value.ajuste) {
      models.push({
        phase: ReceivablePhaseType.Aju,
        harvest: value.harvest ?? "UNKNOWN",
        ...value.ajuste,
        deductionControl: new FormControl(value.ajuste.deductible ?? 0 ),
      })
    }

    this.checkSuccess = this.validate(value);
    this.dataSource = models;
  }

  /* TODO: improve check to succeed on rounded value errors */
  checked: any;
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
