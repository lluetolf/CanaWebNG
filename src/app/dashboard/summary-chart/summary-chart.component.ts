import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import Chart from 'chart.js/auto';
import {Observable, Subscription} from "rxjs";
import {LoggingService} from "../../logging/logging.service";

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

const NAMED_COLORS = [
  CHART_COLORS.red,
  CHART_COLORS.orange,
  CHART_COLORS.yellow,
  CHART_COLORS.green,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.grey,
];

@Component({
  selector: 'app-summary-chart',
  template: `
      <canvas #chart width="600" height="200"></canvas>
  `,
  styleUrls: ['./summary-chart.component.scss']
})
export class SummaryChartComponent implements AfterViewInit {
  @ViewChild('chart')
  private chartRef!: ElementRef;
  private chart!: Chart;
  private readonly data: number[] = [];

  @Input()
  public dataSource!: Observable<Map<number, number[]>>;
  private dataSourceSubscription!: Subscription;


  constructor(private logger: LoggingService) {
  }

  ngAfterViewInit(): void {
    this.dataSourceSubscription = this.dataSource.subscribe(values => {
      const datasets: { label: string, data: number[], fill: boolean }[] = []
      values.forEach((v, k)=> {
        datasets.push({
          label: "Year " + k,
            data: v,
            fill: false
        })
      })

      this.chart = new Chart(this.chartRef.nativeElement, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: false,
          scales: {
            x: {
              beginAtZero: true
            }
          }
        }
      });

    })
  }

  ngOnDestroy() {
    this.dataSourceSubscription.unsubscribe();
  }
}
