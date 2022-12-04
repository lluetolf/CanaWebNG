import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ReceivableService } from './receivable.service';

@Component({
  selector: 'app-receivable',
  templateUrl: './receivable.component.html',
  styleUrls: ['./receivable.component.scss']
})
export class ReceivableComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  harvests = Array.from({ length: 4 }, (_, i) => `${new Date().getFullYear() - i}-${new Date().getFullYear() - i + 1}`);
  harvestControl = new FormControl();
  public get receivables$() {
    return this.receivableService.data$
  }
  public get isLoading$() {
    return this.receivableService.isLoading$
  }

  constructor(private receivableService: ReceivableService) { }

  ngOnInit(): void {
    this.harvestControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.receivableService.refreshData()
    });

    this.harvestControl.patchValue(this.harvests[0]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
