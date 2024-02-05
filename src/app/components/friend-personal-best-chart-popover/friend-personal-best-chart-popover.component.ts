import { Component, Input, OnInit } from '@angular/core';
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';
import { Subscription } from 'rxjs';
import { PersonalBest, PersonalBestRecord } from 'src/app/models/personal-best.model';
import { PersonalBestsService } from 'src/app/services/personal-bests.service';

@Component({
  selector: 'app-friend-personal-best-chart-popover',
  /* templateUrl: './friend-personal-best-chart-popover.component.html',
   */
  styles: [`
    :host {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .popover-content {
      width: 700px;
      height: 300px;
      /* display: flex;
      align-items: center;
      justify-content: center; */
    }

    canvas {
      width: 100%;
      height: 100%;
    }
`],

  template: `
  <div class="popover-content">
    <canvas id="myChart" width="400" height="300"></canvas>
  </div>
  `,
  styleUrls: ['./friend-personal-best-chart-popover.component.scss'],
})
export class FriendPersonalBestChartPopoverComponent  implements OnInit {
  @Input() personalBestExerciseId: string |null = null;
  personalBestExercise!: PersonalBest;
  personalBestRecords: PersonalBestRecord[] = [];


  private personalBestsSubscribtion: Subscription |null = null;

  constructor(
    private personalBestsService: PersonalBestsService
  ) { }

  ngOnInit() {
    if(this.personalBestExerciseId){
      this.personalBestsSubscribtion = this.personalBestsService.getPersonalBestById(this.personalBestExerciseId)
      .subscribe(
        (personalBest) => {
          if (personalBest) {
            //sort by date descending.
            this.personalBestExercise = personalBest;
            this.personalBestRecords = this.personalBestExercise.records.sort((a, b) => {
              const dateA = new Date(a.createdAt).getTime();
              const dateB = new Date(b.createdAt).getTime();
              return dateB - dateA;
            });
            this.initialiseChart(this.personalBestRecords);
          } else {
            //this.redirectToErrorPage('Personal best not found.');
            console.log('No personal best found')
          }
        },
        (error) => {
          console.error('Error fetching personal best:', error);
        }
      );
    }
  }

  ngOnDestroy(){
    if(this.personalBestsSubscribtion){
      this.personalBestsSubscribtion.unsubscribe();
    }
  }

  initialiseChart(records: PersonalBestRecord[]) {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
  
    Chart.register(CategoryScale, LinearScale, BarController, BarElement);
  
    // Destroy previous chart instance if it exists
    Chart.getChart(ctx)?.destroy();
  
    // Sort the records by date in descending order
    const sortedRecords = records.reverse();
  
    const labels = sortedRecords.map(record => new Date(record.createdAt).toLocaleDateString()); // Use date as labels
    const values = sortedRecords.map(record => record.value);
  
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: '# of Records',
            data: values,
            backgroundColor: 'rgba(255, 202, 56, 0.2)', // Specify the background color for the bars
            borderColor: 'rgba(255, 202, 56, 1)', // Specify the border color for the bars
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false, // Set to false to allow the chart to occupy the entire canvas
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true,
          },
        },
      },
    });
  }
  
}
