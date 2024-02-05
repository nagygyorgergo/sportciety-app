import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';
import { PersonalBest } from 'src/app/models/personal-best.model';
import { Userdata } from 'src/app/models/user.model';
import { FriendService } from 'src/app/services/friend.service';
import { PersonalBestsService } from 'src/app/services/personal-bests.service';

@Component({
  selector: 'app-friend-profile-personal-bests',
  templateUrl: './friend-profile-personal-bests.page.html',
  styleUrls: ['./friend-profile-personal-bests.page.scss'],
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
export class FriendProfilePersonalBestsPage implements OnInit {

  strenghtImageUrl = '../../assets/strengthImage.png';
  enduranceImageUrl = '../../assets/enduranceImage.png';

  currentUid: string = ''; //current user's uid.
  friendUid: string | null = null; //current frind's uid

  isStrenghtExpanded = false; //variable to close/open card
  isEnduranceExpanded = false;
  personalBests: PersonalBest[] = [];
  currentUserFrienduids: string[] = [];

  friend: Userdata = {
    dateOfBirth: 0,
    email: '',
    uid: '',
    username: '',
    imageUrl: '',
    friendUids: []
  };

  //Subscribtion variables
  private friendSubscription: Subscription | null = null;
  private currentUserSubscription: Subscription | null = null;
  private afAuthSubscribtion: Subscription | null = null;
  private personalBestsSubscribtion: Subscription |null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private friendService: FriendService,
    private afAuth: AngularFireAuth,
    private personalBestsService: PersonalBestsService
  ) { }

  ngOnInit() {
    this.afAuthSubscribtion = this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUid = user.uid;
        this.currentUserSubscription = this.friendService.getFriendByUid(this.currentUid).subscribe(
          (user) => {
            if (user) {
              this.currentUserFrienduids = user.friendUids;
              // Check if any of the user values are null
              if (this.currentUserFrienduids !== null) {
                this.friendUid = this.getFriendUidFromUrl();
                console.log(this.friendUid);
        
                if (this.friendUid) {
                  this.friendSubscription = this.friendService.getFriendByUid(this.friendUid).subscribe(
                    (user) => {
                      if (user && this.currentUserFrienduids.includes(user.uid)) {
                        this.friend.dateOfBirth = user.dateOfBirth;
                        this.friend.email = user.email;
                        this.friend.uid = user.uid;
                        this.friend.username = user.username;
                        this.friend.imageUrl = user.imageUrl;
        
                        // Call loadNextPage only if none of the user values are null
                        if (
                          this.friend.dateOfBirth !== null &&
                          this.friend.email !== null &&
                          this.friend.uid !== null &&
                          this.friend.username !== null &&
                          this.friend.imageUrl !== null
                        ) {
                          this.getFriendPersonalBests(user.uid);
                        }
                      } else {
                        this.redirectToErrorPage('No friend found');
                      }
                    },
                  );
                }
              }
            } else {
              this.redirectToErrorPage('Couldnt find friend.');
            }
          },
        );
      }
    });
  }

  //free memory
  ngOnDestroy(){
    if(this.currentUserSubscription){
      this.currentUserSubscription.unsubscribe();
    }
    if(this.friendSubscription){
      this.friendSubscription.unsubscribe();
    }
    if(this.afAuthSubscribtion){
      this.afAuthSubscribtion.unsubscribe();
    }
    if(this.personalBestsSubscribtion){
      this.personalBestsSubscribtion.unsubscribe();
    }
  }

  getFriendPersonalBests(friendUid: string){
    this.personalBestsSubscribtion = this.personalBestsService.getPersonalBestsByUid(friendUid).subscribe(
      personalBests => {
        this.personalBests = personalBests;
        console.log('Personal Bests:', personalBests);
      },
      error => {
        console.error('Error fetching personal bests:', error);
      }
    );
  }

  redirectToErrorPage(message: string){
    this.router.navigate(['/error', message]);
  }

  //Redirect to details
  redirectToExerciseDetails(exerciseId: string){
    this.router.navigate(['/friend-profile-personal-best-details', exerciseId]);
  }

  getFriendUidFromUrl(): string | null {
    // Use paramMap to access route parameters
    const friendUid = this.route.snapshot.paramMap.get('friendUid');
    // If the friendUid is not found, you can handle it appropriately (return null, throw an error, etc.)
    return friendUid;
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
}
