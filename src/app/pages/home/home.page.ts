import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { Observable, Subscription, map } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  currentUid: string = '';
  userPosts: Post[] = [];
  postImages: string[] = [];
  usernames: { [userId: string]: Observable<string> } = {}; //this is for storing post creator's usernames

  itemsPerPage = 5;
  currentPage = 1;
  isLoading = false;
  loadedAllPosts = false;

  
  //subscribtion variable
  private afAuthSubscribtion: Subscription | null = null;

  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private router: Router
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

      const newPosts = await this.postService.getFriendsPosts(
        startIndex,
        endIndex,
        this.currentUid
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
        this.loadUsernamesForFriendsPosts(newPosts);
        this.loadImagesForFriendsPosts(newPosts);
        this.currentPage++;

        console.log('friendspostslength: ' + this.userPosts.length)

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

  async loadImagesForFriendsPosts(posts: Post[]) {
    //this.postImages = []; // Clear the postImages array for the current page.
    for (const post of posts) {
      const postId = post.id;
      const images = await this.postService.getPostImages(postId, post.uid);
      this.postImages = this.postImages.concat(images);
    }
  }

  async loadUsernamesForFriendsPosts(posts: Post[]) {
    for (const post of posts) {
      this.usernames[post.uid] = this.userService.getUserById(post.uid).pipe(
        map((user) => user.username)
      );
    }
  }

  
  redirectToFriendsPage(){
    this.router.navigateByUrl('/friends', {replaceUrl: true});
  }
}
