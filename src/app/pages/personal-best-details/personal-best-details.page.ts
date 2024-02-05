import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PersonalBest, PersonalBestRecord } from 'src/app/models/personal-best.model';
import { PersonalBestsService } from 'src/app/services/personal-bests.service';
import { BarController, BarElement, CategoryScale, Chart, LinearScale } from 'chart.js';

@Component({
  selector: 'app-personal-best-details',
  templateUrl: './personal-best-details.page.html',
  styleUrls: ['./personal-best-details.page.scss'],
})
export class PersonalBestDetailsPage implements OnInit {

  personalBestExerciseId: string |null = null;
  currentUid: string | null = null;
  personalBestExercise: PersonalBest | null = null;

  personalBestRecords: PersonalBestRecord[] = [];

  recordForm!: FormGroup;

  //Subscribtion variable
  private personalBestsSubscribtion: Subscription |null = null;
  private afAuthSubscribtion: Subscription | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private personalBestsService: PersonalBestsService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private fb: FormBuilder,
    private alertController: AlertController,

  ) { }

  ngOnInit() {
    //Fetch parameter from url
    this.personalBestExerciseId = this.getExerciseIdFromUrl();

    this.afAuthSubscribtion = this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUid = user.uid;
      } 

      if(this.personalBestExerciseId){
        this.personalBestsSubscribtion = this.personalBestsService.getPersonalBestById(this.personalBestExerciseId)
        .subscribe(
          (personalBest) => {
            if (personalBest) {
              if(personalBest.uid!== this.currentUid){
                this.redirectToErrorPage('Not allowed to see other users data.');
                console.log('uid dowesnt match')
              }
              else{
                //sort by date descending.
                this.personalBestExercise = personalBest;
                this.personalBestRecords = this.personalBestExercise.records.sort((a, b) => {
                  const dateA = new Date(a.createdAt).getTime();
                  const dateB = new Date(b.createdAt).getTime();
                  return dateB - dateA;
                });
                this.initialiseChart(this.personalBestRecords);
              }
            } else {
              this.redirectToErrorPage('Personal best not found.');
              console.log('Personal Best not found.');
            }
          },
          (error) => {
            console.error('Error fetching personal best:', error);
          }
        );
      }
    });
    this.initializeForm();
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
   
  ngOnDestroy(){
    if(this.personalBestsSubscribtion){
      this.personalBestsSubscribtion.unsubscribe();
    }
    if(this.afAuthSubscribtion){
      this.afAuthSubscribtion.unsubscribe();
    }
  }

  //Initialise form fields and validators
  initializeForm(): void {
    const currentDate = new Date().toISOString();
    this.recordForm = this.fb.group({
      createdAt: [currentDate, Validators.required], // Set the initial value to the current date
      value: ['', Validators.required],
    });
  }

  submitRecord(personalBestId: string | undefined){
    if(this.recordForm.valid && personalBestId){
      const newRecord = {
        createdAt: this.recordForm.get('createdAt')?.value,
        value: this.recordForm.get('value')?.value,
      }

      this.personalBestsService.addRecordElement(personalBestId, newRecord)
      .then(() => {
        console.log('Record element added successfully!');
      })
      .catch((error) => {
        console.error('Error adding record element:', error);
      });
    }
  }

  async removeRecord(recordId: string | null) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete this record?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: async () => {
            if(recordId && this.personalBestExercise){
              this.personalBestsService.removeRecordById(this.personalBestExercise.id, recordId)
              .then(() => {
                console.log('Record removed successfully');
              })
              .catch((error) => {
                console.error('Error removing record:', error.message);
              });
            }
            else{
              console.log('no id parameter')
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async showAlert(header:any, message:any){
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  getExerciseIdFromUrl(){
    const exerciseName = this.activatedRoute.snapshot.paramMap.get('exerciseId');
    return exerciseName;
  }

  //Redirect to error if personalBestExercise's uid id not matching with current user's uid
  redirectToErrorPage(message: string){
    this.router.navigate(['/error', message]);
  }
 
}
