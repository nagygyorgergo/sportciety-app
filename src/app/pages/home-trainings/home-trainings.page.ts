import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { Observable, Subscription, map } from 'rxjs';
import { Training } from 'src/app/models/training.model';
import { TrainingService } from 'src/app/services/training-plan.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-trainings',
  templateUrl: './home-trainings.page.html',
  styleUrls: ['./home-trainings.page.scss'],
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

export class HomeTrainingsPage implements OnInit {
  currentUid: string = '';
  friendsTrainingplans: Training[] = [];
  postImages: string[] = [];
  usernames: { [userId: string]: Observable<string> } = {}; //this is for storing training creator's usernames

  itemsPerPage = 10;
  currentPage = 1;
  isLoading = false;
  loadedAllPosts = false;

  expandedTrainings: Set<string> = new Set<string>();

  
  //subscribtion variable
  private afAuthSubscribtion: Subscription | null = null;
 
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  constructor(
    private trainingService: TrainingService,
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private router: Router,
    ) { }
  
  //initially display posts
  //No need to unsubscribe bc. of async pype in view.
  async ngOnInit() {
    this.afAuthSubscribtion = this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUid = user.uid;
        this.loadNextPage();
      } 
    });

  }

  ngOnDestroy(): void{
    console.log("ngonDestroy called");
    if(this.afAuthSubscribtion){
      this.afAuthSubscribtion.unsubscribe();
    }
  }

  async loadNextPage(event?: any) {
    if (this.isLoading) return;

    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'bubbles'
    });
    await loading.present();

    try {
      //loading
      console.log(this.currentUid);
      this.isLoading = true;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;

      const newTrainingplans = await this.trainingService.getFriendsTrainingplans(
        startIndex,
        endIndex,
        this.currentUid
      );
      console.log(newTrainingplans);

      //check if we reached the beginning of the post list.
      if(this.currentPage !== 1){
        for (let i = 0; i < newTrainingplans.length; i++) {
          if(this.friendsTrainingplans[0].id==newTrainingplans[i].id){
            this.loadedAllPosts = true;
            this.infiniteScroll.disabled = true
            loading.dismiss();
          }
        }
      }

      if (newTrainingplans.length > 0 && !this.loadedAllPosts) {

        // Append the new posts to the existing userPosts array.
        this.friendsTrainingplans = this.friendsTrainingplans.concat(newTrainingplans);
        await this.loadUsernamesForFriendsTrainings(newTrainingplans);
        /* await this.loadImagesForFriendsPosts(newTrainingplans); */
        this.currentPage++;

        console.log('friendstrainingslength: ' + this.friendsTrainingplans.length)

        loading.dismiss();

        if (event) {
          event.target.complete();
        }
        
      } else {
        if (this.infiniteScroll) {
          this.infiniteScroll.disabled = true; // Disable Infinite Scroll when no new posts are loaded
        }
        loading.dismiss();
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  /* async loadImagesForFriendsPosts(posts: Post[]) {
    //this.postImages = []; // Clear the postImages array for the current page.
    for (const post of posts) {
      const postId = post.id;
      const images = await this.postService.getPostImages(postId, post.uid);
      this.postImages = this.postImages.concat(images);
    }
  } */

  async loadUsernamesForFriendsTrainings(trainings: Training[]) {
    for (const training of trainings) {
      this.usernames[training.uid] = this.userService.getUserById(training.uid).pipe(
        map((user) => user.username)
      );
    }
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

  //Method for alert displaying
  /* async alertPopup(header: string, message: string){
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  } */

  //like post method
  /* async likePost(postId: string) {
    try {
      //Finding current post's index
      const postIndex = this.userPosts.findIndex(post => post.id === postId);
      console.log(postIndex)

      if(postIndex !== -1){
        const currentPost = this.userPosts[postIndex];

        // Check if the current user has already liked the post
        const likedByCurrentUser = currentPost.likerUids.includes(this.currentUid);

        if (!likedByCurrentUser) {
          currentPost.likerUids.push(this.currentUid);
          currentPost.likeCount++;
          await this.postService.likePost(postId, this.currentUid);
          console.log("Post liked successfully!");
        }
        else{
          this.alertPopup('Already liked this post', 'sory :(');
        }
        // Update the posts array
        this.userPosts[postIndex] = currentPost;
      }
      
      console.log("postId: " + postId + '\n' + 'uid: ' + this.currentUid);
    } catch (error) {
      console.error("Error liking post:", error);
      // Handle the error as needed, e.g., display a user-friendly message
    }
  }
   */
  redirectToFriendsPage(){
    this.router.navigateByUrl('/friends', {replaceUrl: true});
  }
}
