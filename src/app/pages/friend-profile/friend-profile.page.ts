import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { Userdata } from 'src/app/models/user.model';
import { FriendService } from 'src/app/services/friend.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-friend-profile',
  templateUrl: './friend-profile.page.html',
  styleUrls: ['./friend-profile.page.scss'],
})
export class FriendProfilePage implements OnInit {
  
  currentUid: string = ''; //current user's uid.
  currentUserFrienduids: string[] = [];

  friendUid: string | null;
  friend: Userdata = {
    dateOfBirth: 0,
    email: '',
    uid: '',
    username: '',
    imageUrl: '',
    friendUids: []
  };

  //Variables for post listing
  userPosts: Post[] = [];
  postImages: string[] = [];
  postLikerNames: string[] = [];

  itemsPerPage = 5;
  currentPage = 1;
  isLoading = false;
  loadedAllPosts = false;

  //subscribtion variables
  private friendSubscription: Subscription | null = null;
  private currentUserSubscription: Subscription | null = null;
  private afAuthSubscribtion: Subscription | null = null;

  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private friendService: FriendService,
    private postService: PostService,
    private loadingController: LoadingController,
    private afAuth: AngularFireAuth,
    private alertController: AlertController
    ) {
      this.friendUid = null;
  }

  ngOnInit() {
    this.afAuthSubscribtion = this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUid = user.uid;
        this.currentUserSubscription = this.friendService.getFriendByUid(this.currentUid).subscribe(
          (user) => {
            if (user) {
              this.currentUserFrienduids = user.friendUids;
            } else {
              this.redirectToErrorPage();
            }
          },
        );
  
        // Check if any of the user values are null
        if (this.currentUserFrienduids !== null) {
          this.friendUid = this.getFriendUidFromUrl();
          console.log(this.friendUid);
  
          if (this.friendUid) {
            this.friendSubscription = this.friendService.getFriendByUid(this.friendUid).subscribe(
              (user) => {
                if (user) {
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
                    this.loadNextPage();
                  }
                } else {
                  this.redirectToErrorPage();
                }
              },
            );
          }
        }
      }
    });
  }
  
  //Free memory
  ngOnDestroy(): void{
    if(this.currentUserSubscription){
      this.currentUserSubscription.unsubscribe();
    }
    if(this.friendSubscription){
      this.friendSubscription.unsubscribe();
    }
    if(this.afAuthSubscribtion){
      this.afAuthSubscribtion.unsubscribe();
    }
  }

  //Redirect to error if user not found
  redirectToErrorPage(){
    this.router.navigateByUrl('/error', {replaceUrl: true});
  }

  //redirect user to list friends page (after deleting friend)
  redirectFriendsPage(){
    this.router.navigateByUrl('/friends', {replaceUrl: true});
  }

  getFriendUidFromUrl(): string | null {
    // Use paramMap to access route parameters
    const friendUid = this.route.snapshot.paramMap.get('friendUid');
    // If the friendUid is not found, you can handle it appropriately (return null, throw an error, etc.)
    return friendUid;
  }

  //Loading posts lazy
  async loadNextPage(event?: any) {
    if (this.isLoading) return;

    const loading = await this.loadingController.create({
      message: 'Loading...',
      spinner: 'bubbles'
    });
    await loading.present();

    try {
      //loading
      console.log(this.friend.uid);
      this.isLoading = true;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;

      const newPosts = await this.postService.getUserPosts(
        startIndex,
        endIndex,
        this.friend.uid
      );
      console.log(newPosts);

      //check if we reached the beginning of the post list.
      if(this.currentPage !== 1){
        for (let i = 0; i < newPosts.length; i++) {
          if(this.userPosts[0].id==newPosts[i].id){
            this.loadedAllPosts = true;
            this.infiniteScroll.disabled = true
            loading.dismiss();
          }
        }
      }

      if (newPosts.length > 0 && !this.loadedAllPosts) {
        loading.dismiss();

        // Append the new posts to the existing userPosts array.
        this.userPosts = this.userPosts.concat(newPosts);
        this.loadImagesForUserPosts(newPosts);
        this.currentPage++;

        console.log('userpostslength: ' + this.userPosts.length)

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

  async loadImagesForUserPosts(posts: Post[]) {
    //this.postImages = []; // Clear the postImages array for the current page.
    for (const post of posts) {
      const postId = post.id;
      const images = await this.postService.getPostImages(postId, this.friend.uid);
      this.postImages = this.postImages.concat(images);
    }
  }

  //Method for alert displaying
  async alertPopup(header: string, message: string){
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  //like post method
  async likePost(postId: string) {
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
  
  //method for deleting friend
  async deleteFriend(friendUid: string) {
    const alert = await this.alertController.create({
    header: 'Confirm Deletion',
    message: `Are you sure you want to delete post?`,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Delete',
        handler: async () => {
          try {
            const isDeleted = await this.friendService.deleteFriend(this.currentUid, friendUid);

            if (isDeleted) {
              // Remove the deleted post from the userPosts array
              this.redirectFriendsPage();
              this.alertPopup('Delete finished', 'Deleted successfully')
              //Back to beginning of posts
            }
            
          } catch (error) {
            console.error('Error deleting post:', error);
            this.alertPopup('Something went wrond', 'Delete failed')
          }
        }
      }
    ] 
    });
    await alert.present();
  }


}
