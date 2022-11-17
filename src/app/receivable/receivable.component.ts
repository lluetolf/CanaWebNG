import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Receivable } from './receivable.model';
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

  receivables$ = new Subject<Receivable[]>();
  loading$ = new Subject<boolean>();

  constructor(private receivableService: ReceivableService) { }

  ngOnInit(): void {
    this.harvestControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((harvest) => {
      this.loading$.next(true);
      console.log("loading")
      this.receivableService.getReceivables(harvest).pipe(take(1)).subscribe((items) => {        
        this.receivables$.next(items);
        this.loading$.next(false);
      }, () => {
        this.loading$.next(false);
      });
    });

    this.harvestControl.patchValue(this.harvests[0]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
