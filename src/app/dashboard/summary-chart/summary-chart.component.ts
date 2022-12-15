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
    <canvas #yearlyTotalChart width="600" height="200"></canvas>
  `,
  styleUrls: ['./summary-chart.component.scss']
})
export class SummaryChartComponent implements AfterViewInit {
  @ViewChild('chart')
  private chartRef!: ElementRef;
  private chart!: Chart;

  @ViewChild('yearlyTotalChart')
  private yearlyTotalChartRef!: ElementRef;
  private yearlyTotalChart!: Chart;


  @Input()
  public dataSource!: Observable<Map<number, number[]>>;
  private dataSourceSubscription!: Subscription;


  constructor(private logger: LoggingService) {
  }

  ngAfterViewInit(): void {
    this.dataSourceSubscription = this.dataSource.subscribe(values => {
      const datasets: { label: string, data: number[], fill: boolean }[] = []
      const yearlyTotal: { year: string, total: number }[] = []

      const sortedValues = new Map([...values.entries()].sort());
      sortedValues.forEach((v, k) => {
        datasets.push({
          label: "Year " + k,
          data: v,
          fill: false
        })
        yearlyTotal.push({year: "" + k, total: v.reduce((acc, cur) => acc += cur, 0)})
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

      this.yearlyTotalChart = new Chart(this.yearlyTotalChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: yearlyTotal.map(v => v.year),
          datasets: [{
            label: "Total annual cost",
            data: yearlyTotal.map(v => v.total),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1
          }]
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
