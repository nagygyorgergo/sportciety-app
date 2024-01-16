import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../../services/training-plan.service';
import { Exercise, Training } from '../../models/training.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-plan-training',
  templateUrl: './plan-training.page.html',
  styleUrls: ['./plan-training.page.scss'],
})
export class PlanTrainingPage implements OnInit {
  currentUid!: string;
  details!: FormGroup | any;
  nameForm!: FormGroup | any;
  addedExercises: Exercise[] = [];

   //Subscribtion variable
   private afAuthSubscribtion: Subscription | null = null;


  constructor(
    private trainingService: TrainingService,
    private afAuth: AngularFireAuth,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private fb: FormBuilder,
    private router: Router
    ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUid = user.uid;
        console.log(this.currentUid);
      }  
    });
  }

  ngOnInit() {
    this.nameForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
    this.details = this.fb.group({
      exerciseName: ['', [Validators.required, Validators.minLength(4)]],
      weight: ['', [Validators.required]],
      rounds: ['', [Validators.required]],
      reps: ['', [Validators.required]],
    });
  }

  
  //Free memory
  ngOnDestroy(): void{
    if(this.afAuthSubscribtion){
      this.afAuthSubscribtion?.unsubscribe();
    }
  }

  addExercise(){
    const exercise: Exercise = {
      name: this.details.get('exerciseName').value,
      weight: this.details.get('weight').value,
      rounds: this.details.get('rounds').value,
      reps: this.details.get('reps').value
    }
    this.addedExercises.push(exercise);
    //console.log(this.addedExercises[0]);
  }

  async addNewTraining() {
    const training: Training |null ={
      id: '',
      uid: this.currentUid,
      name: this.nameForm.get('name')?.value,
      createdAt: new Date().getTime(),
      exercises: this.addedExercises,
      isShared: false,
      sharingDate: 0
      /* [
        {
          name: 'Exercise 2',
          weight: 'medium',
          rounds: 3,
          reps: 10
        }, 
        {
          name: 'Exercise 2',
          weight: 'low',
          rounds: 4,
          reps: 8
        },
        {
          name: 'Exercise 2',
          weight: 'high',
          rounds: 4,
          reps: 8
        },
        {
          name: 'Exercise 2',
          weight: 'high',
          rounds: 4,
          reps: 8
        }
      ]  */
    };
    
    const loading = await this.loadingController.create();
    await loading.present();
    try {
      if(training){
        const trainingRef = await this.trainingService.addTraining(training);
        console.log('Training added successfully. Document reference:', trainingRef);
      }
      else{
        this.showAlert('Adding failed', 'Try again');
      }
    } catch (error) {
      
      console.error('Error adding training:', error);
    }
    finally{
      await loading.dismiss();
      this.router.navigateByUrl('/display-my-trainings', { replaceUrl: true });
    }
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
