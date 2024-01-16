import { Component, OnInit } from '@angular/core';
import { Training } from '../../models/training.model';
import { TrainingService } from '../../services/training-plan.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

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
  currentUid: string = '';
  expandedTrainings: Set<string> = new Set<string>();
  
  searchTerm: string = '';
  showSharedOnly: boolean = false;
  myTrainingPlans: Training[] = [];
  filteredTrainingPlans: Training[] = [];

  //Subscribtion variable
  private afAuthSubscribtion: Subscription | null = null;
  private trainingPlansSubscription: Subscription | null = null;

  constructor(
    private trainingService: TrainingService,
    private afAuth: AngularFireAuth,
    private alertController: AlertController
    ) {}

  ngOnInit() {
    this.afAuthSubscribtion = this.afAuth.authState.subscribe(user => {
      if (user) {
        const uid = user.uid;
        this.trainingPlansSubscription = this.trainingService.getMyTrainings(uid).subscribe(trainings => {
          this.myTrainingPlans = trainings;
          this.filterItems(this.searchTerm);
        });
      }
    });
  }

  //Free memory
  ngOnDestroy(): void{
    if(this.afAuthSubscribtion){
      this.afAuthSubscribtion?.unsubscribe();
    }
    if(this.trainingPlansSubscription){
      this.trainingPlansSubscription.unsubscribe();
    }
  }

  //Filter function for searchban
  filterItems(searchTerm: string) {
    this.showSharedOnly = false;
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

  //Show shared trainings only
  showSharedTrainings() {
    if (this.showSharedOnly) {
      // Filter only those trainings with isShared member set to true
      this.filteredTrainingPlans = this.myTrainingPlans.filter(training => training.isShared === true);
    } else {
      // If showSharedOnly is false, display all training plans
      this.filteredTrainingPlans = [...this.myTrainingPlans];
    }
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

  async deleteTraining(training: Training, event: Event): Promise<void> {
    event.stopPropagation();//prevent toggleDetails from showing training details
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

  async shareTraining(training: Training, event: Event){
    event.stopPropagation();//prevent toggleDetails from showing training details
    const alert = await this.alertController.create({
      header: 'Confirm sharing',
      message: `Are you sure you want to share ${training.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Share',
          handler: async () => {
            try {
              await this.trainingService.shareTraining(training.id);;
              console.log('Training shared successfully.');
            } catch (error) {
              console.error('Error sharing training:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
