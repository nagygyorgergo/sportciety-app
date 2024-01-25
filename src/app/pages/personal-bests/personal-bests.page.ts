import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';
import { PersonalBestsService } from 'src/app/services/personal-bests.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PersonalBest } from '../../../app/models/personal-best.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-bests',
  templateUrl: './personal-bests.page.html',
  styleUrls: ['./personal-bests.page.scss'],
  animations: [
    trigger('fadeIn', [
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
        }),
        animate('200ms ease-out'),
      ]),
      transition('* => void', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ]),
    trigger('fadeOut', [
      transition('void => *', [
        style({
          opacity: 1,
          transform: 'translateY(0)',
        }),
        animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
      transition('* => void', [
        animate('200ms ease-in', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class PersonalBestsPage implements OnInit {
  strenghtImageUrl = '../../assets/strengthImage.png';
  enduranceImageUrl = '../../assets/enduranceImage.png'

  currentUid: string = '';
  isStrenghtExpanded = false; //variable to close/open card
  isEnduranceExpanded = false;
  personalBests: PersonalBest[] = [];
  exerciseForm!: FormGroup;

  //Subscribtion variable
  private afAuthSubscribtion: Subscription | null = null;
  private personalBestsSubscribtion: Subscription |null = null;

  constructor(
    private personalBestsService: PersonalBestsService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUid = user.uid;
        this.personalBestsService.getPersonalBestsByUid(this.currentUid).subscribe(
          personalBests => {
            this.personalBests = personalBests;
            console.log('Personal Bests:', personalBests);
            // Do something with the fetched personal bests
          },
          error => {
            console.error('Error fetching personal bests:', error);
          }
        );
      }  
    });
    
    this.exerciseForm = this.fb.group({
      exerciseName: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  //Free memory
  ngOnDestroy(): void{
    if(this.afAuthSubscribtion){
      this.afAuthSubscribtion?.unsubscribe();
    }
    if(this.personalBestsSubscribtion){
      this.personalBestsSubscribtion.unsubscribe();
    }
  }

  //Shows details when training name is clicked
  toggleDetails(cardName: string): void {
    if(cardName === 'strength'){
      this.isStrenghtExpanded = !this.isStrenghtExpanded;
      console.log('toggle details pressed ' + this.isStrenghtExpanded);
    }
    else{
      this.isEnduranceExpanded = !this.isEnduranceExpanded;
    }
  }

  //Method for creating a new exercise for example 400m running or bench press.
  async createNewPersonalBestExercise(exerciseType: string): Promise<void> {
    const hasExercise = this.personalBests.some(exercise => exercise.exerciseName.toLocaleLowerCase() === this.exerciseForm.get('exerciseName')?.value.toLocaleLowerCase());
    if(!hasExercise){
      const loading = await this.loadingController.create();
      await loading.present();
      this.personalBestsService.createPersonalBestStrenghtExercise(this.currentUid, this.exerciseForm.get('exerciseName')?.value, exerciseType)
        .then(async () => {
          console.log('Personal best exercise created successfully');
          await loading.dismiss();
        })
        .catch(error => {
          console.error('Error creating personal best:', error);
          this.showAlert('Adding failed', 'Try again');
        });
        this.exerciseForm.reset();
    }
    else{
      this.showAlert('Adding failed', 'You have already added this exercise.');
    }
  }

  //Delete personal best exercise
  async deletePersonalBestExercise(personalBestExercise: PersonalBest, event: Event): Promise<void> {
    event.stopPropagation();
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete ${personalBestExercise.exerciseName}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: async () => {
            this.personalBestsService.deletePersonalBestById(personalBestExercise.id)
            .then(() => {
              console.log(`Personal best record deleted successfully.`);
            })
            .catch((error) => {
              this.showAlert('Failed to delete', 'Something went wrong.');
              console.error(`Error deleting personal best record: ${error}`);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  //Redirect to details
  redirectToExerciseDetails(exerciseName: string){
    this.router.navigate(['/personal-best-details', exerciseName]);
  }

  //Prevent from closing card on form clicking
  stopClickPropagation(event: Event): void {
    event.stopPropagation();
  }
  

  async showAlert(header:any, message:any){
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
