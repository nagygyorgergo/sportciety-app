import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Training } from 'src/app/models/training.model';
import { TrainingService } from 'src/app/services/training-plan.service';

@Component({
  selector: 'app-friend-profile-trainings',
  templateUrl: './friend-profile-trainings.page.html',
  styleUrls: ['./friend-profile-trainings.page.scss'],
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
export class FriendProfileTrainingsPage implements OnInit {

  friendUid: string | null; //friend's uid

  expandedTrainings: Set<string> = new Set<string>();
  searchTerm: string = '';
  filteredTrainingPlans: Training[] = [];
  friendTrainingPlans: Training[] = [];

  private trainingPlansSubscription: Subscription | null = null;

  constructor(
    private trainingService: TrainingService,
    private route: ActivatedRoute 
  ) { 
    this.friendUid = null;
  }

  ngOnInit() {
    this.friendUid = this.getFriendUidFromUrl();
    if(this.friendUid){
      this.trainingPlansSubscription = this.trainingService.getFriendTrainings(this.friendUid).subscribe(trainings => {
        this.friendTrainingPlans = trainings;
        console.log('friendTrainingPlans lenght: ' + this.friendTrainingPlans.length)
        this.filterItems(this.searchTerm);
      });
    }
  }

  ngOnDestroy(){
    if(this.trainingPlansSubscription){
      this.trainingPlansSubscription.unsubscribe();
    }
  }

  getFriendUidFromUrl(): string | null {
    // Use paramMap to access route parameters
    const friendUid = this.route.snapshot.paramMap.get('friendUid');
    // If the friendUid is not found, you can handle it appropriately (return null, throw an error, etc.)
    return friendUid;
  }


  //Filter function for searchban
  filterItems(searchTerm: string) {
    if (!searchTerm) {
      this.filteredTrainingPlans = this.friendTrainingPlans;
      console.log(this.searchTerm);
      return;
    }
  
    searchTerm = searchTerm.toLowerCase();
  
    this.filteredTrainingPlans = this.friendTrainingPlans.filter((trainingPlan: Training) => {
      const title = trainingPlan.name?.toLowerCase();
      if(title==='' || title === null){
        return true;
      }
      return title && title.includes(searchTerm);
    });
  }

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

}
