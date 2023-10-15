import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { Observable, map } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { CreatePostService } from 'src/app/services/create-post.service';
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

  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  constructor(
    private createPostService: CreatePostService,
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    
    ) { }
  
  //initially display posts
  async ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUid = user.uid;
        this.loadNextPage();
      }  
    });
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

      const newPosts = await this.createPostService.getUserPosts(
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
        this.loadUsernamesForUserPosts(newPosts);
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
      const images = await this.createPostService.getPostImages(postId);
      this.postImages = this.postImages.concat(images);
    }
  }

  async loadUsernamesForUserPosts(posts: Post[]) {
    for (const post of posts) {
      this.usernames[post.uid] = this.userService.getUserById(post.uid).pipe(
        map((user) => user.username)
      );
    }
  }
}
