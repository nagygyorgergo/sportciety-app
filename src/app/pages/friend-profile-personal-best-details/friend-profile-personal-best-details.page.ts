import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';
import { Subscription } from 'rxjs';
import { PersonalBest, PersonalBestRecord } from 'src/app/models/personal-best.model';
import { PersonalBestsService } from 'src/app/services/personal-bests.service';

@Component({
  selector: 'app-friend-profile-personal-best-details',
  templateUrl: './friend-profile-personal-best-details.page.html',
  styleUrls: ['./friend-profile-personal-best-details.page.scss'],
})
export class FriendProfilePersonalBestDetailsPage implements OnInit {

  personalBestExerciseId: string |null = null;
  currentUid: string | null = null;
  personalBestExercise!: PersonalBest;
  personalBestRecords: PersonalBestRecord[] = [];

  //Subscribtion variable
  private personalBestsSubscribtion: Subscription |null = null;
  private afAuthSubscribtion: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personalBestsService: PersonalBestsService
  ) { }

  ngOnInit() {
    //Fetch parameter from url
    this.personalBestExerciseId = this.getExerciseIdFromUrl();

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
            this.redirectToErrorPage('Personal best not found.');
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
    if(this.afAuthSubscribtion){
      this.afAuthSubscribtion.unsubscribe();
    }
  }

  getExerciseIdFromUrl(): string | null {
    // Use paramMap to access route parameters
    const exerciseId = this.route.snapshot.paramMap.get('exerciseId');
    // If the friendUid is not found, you can handle it appropriately (return null, throw an error, etc.)
    return exerciseId;
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
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true,
          },
        },
      },
    });
  }

  redirectToErrorPage(message: string){
    this.router.navigate(['/error', message]);
  }

}
