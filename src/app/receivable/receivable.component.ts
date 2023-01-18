import {OnInit} from '@angular/core';
import {OnDestroy} from '@angular/core';
import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {ReceivableService} from './receivable.service';
import {LoggingService} from "../logging/logging.service";

@Component({
  selector: 'app-receivable',
  templateUrl: './receivable.component.html',
  styleUrls: ['./receivable.component.scss']
})
export class ReceivableComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  harvests = Array.from({length: 4}, (_, i) => `${(new Date().getFullYear() - i).toString().substring(2)}-${(new Date().getFullYear() - i + 1).toString().substring(2)}`);
  harvestControl = new FormControl();

  public get receivables$() {
    return this.receivableService.consolidatedReceivables$
  }

  public get isLoading$() {
    return this.receivableService.isLoading$
  }

  constructor(private receivableService: ReceivableService,
              private logger: LoggingService) {
  }

  ngOnInit(): void {
    this.harvestControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged()).subscribe(() => {
      this.updateReceivableList()
    });


    this.harvestControl.patchValue(this.harvests[0]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  private updateReceivableList() {
    this.receivableService.getDataForHarvest(this.harvestControl.value)
  }
}
