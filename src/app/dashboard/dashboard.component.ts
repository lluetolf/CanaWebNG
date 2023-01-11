import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {PayableService} from "../payable/payable.service";
import {delay, map, tap} from "rxjs/operators";
import {MonthTotal} from "../payable/monthtotal.model";
import {LoggingService} from "../logging/logging.service";
import {Observable, Subject, BehaviorSubject} from "rxjs";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public env: String;
  public buildTime: String;
  public commitSha: String;
  public branchName: String;

  public summaryChart$ = new Subject<Map<number, number[]>>;
  public isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private payableService: PayableService, private logger: LoggingService) {
    this.env = environment.release.env
    this.buildTime = environment.release.buildTime
    this.commitSha = environment.release.commitSha
    this.branchName = environment.release.branchName
  }

  ngOnInit(): void {
    this.logger.info("Init DashboardComponent")

    this.isLoading$.next(true)
    this.createPayableSummary().pipe(
      map(x => {
        let years = new Map<number, number[]>();
        x.forEach(entry => {
          const year = years.get(entry.year)
          if (year === undefined) {
            const newYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            newYear[entry.month] = entry.total
            years.set(entry.year, newYear)
          } else {
            year[entry.month] = entry.total
          }
        })
        return years
      }),
    ).subscribe(x => {
      this.summaryChart$.next(x)
      this.isLoading$.next(false)
    })
  }

  private createPayableSummary(): Observable<MonthTotal[]> {
    return this.payableService.data$.pipe(
      delay(5000),
      map(x => {
        return x.map<MonthTotal>(p => new MonthTotal(
          p.transactionDate.getFullYear(),
          p.transactionDate.getMonth(),
          p.pricePerUnit * p.quantity))
          .reduce((acc: MonthTotal[], mt: MonthTotal) => {
            const itemIdx = acc.findIndex((a) => a.year === mt.year && a.month === mt.month);
            if (itemIdx !== -1) {
              acc[itemIdx].total += mt.total;
            } else {
              acc.push(mt);
            }
            return acc
          }, [])
      })
    )
  }
}
