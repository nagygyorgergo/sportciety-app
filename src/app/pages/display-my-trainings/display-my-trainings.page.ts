import { Component, OnInit } from '@angular/core';
import { Training } from '../../models/training.model';
import { TrainingService } from '../../services/training-plan.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-display-my-trainings',
  templateUrl: './display-my-trainings.page.html',
  styleUrls: ['./display-my-trainings.page.scss'],
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

export class DisplayMyTrainingsPage implements OnInit {
  currentUid: string | any;
  expandedTrainings: Set<string> = new Set<string>();
  
  searchTerm: string | any;
  myTrainingPlans: Training[] = [];
  filteredTrainingPlans: Training[] = [];

  constructor(
    private trainingService: TrainingService,
    private afAuth: AngularFireAuth,
    private alertController: AlertController
    ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const uid = user.uid;
        this.trainingService.getMyTrainings(uid).subscribe(trainings => {
          this.myTrainingPlans = trainings;
          this.filterItems(this.searchTerm);
        });
      }
    });
  }

  //Filter function for searchban
  filterItems(searchTerm: string) {
    if (!searchTerm) {
      this.filteredTrainingPlans = this.myTrainingPlans;
      console.log(this.searchTerm);
      return;
    }
  
    searchTerm = searchTerm.toLowerCase();
  
    this.filteredTrainingPlans = this.myTrainingPlans.filter((trainingPlan: Training) => {
  
      const title = trainingPlan.name?.toLowerCase();
      if(title==='' || title === null){
        return true;
      }
  
      return title && title.includes(searchTerm);
    });
  }

  //Function for ion-searchbar's onClear action
  clearSearchTerm(){
    this.searchTerm='';
    this.filterItems(this.searchTerm);
  }

  //Shows details when training name is clicked
  toggleDetails(training: Training): void {
    if (this.expandedTrainings.has(training.id)) {
      this.expandedTrainings.delete(training.id);
    } else {
      this.expandedTrainings.add(training.id);
      
    }
  }

  //boolean for deciding if training shuld be colored primary
  isTrainingExpanded(training: Training): boolean {
    return this.expandedTrainings.has(training.id);
  }

  async deleteTraining(training: Training): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: `Are you sure you want to delete ${training.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              await this.trainingService.deleteTraining(training);
              console.log('Training deleted successfully.');
            } catch (error) {
              console.error('Error deleting training:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
