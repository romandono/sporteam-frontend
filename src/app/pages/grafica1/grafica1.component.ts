import { Component, ChangeDetectionStrategy} from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'app-grafica1',
    templateUrl: './grafica1.component.html',
    styles: [],
    standalone: false
})
export class Grafica1Component {

  // Doughnut
  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [350, 450, 100],
        backgroundColor: ['#6857E6', '#009FEE', '#F02059']
      }
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor() { }

}
