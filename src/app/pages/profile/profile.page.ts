import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { AvatarService } from '../../services/avatar.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../../services/user.service';
import { Post } from 'src/app/models/post.model';
import { Observable, map } from 'rxjs';
import { CreatePostService } from 'src/app/services/create-post.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: any;
  username!: string;
  email: string | any;
  dateOfBirth!: number;
  uid!: string;
  imageUrl: string = '../../assets/default-profile-picture.png';

  //Variables for post listing
  userPosts: Post[] = [];
  postImages: string[] = [];
  usernames: { [userId: string]: Observable<string> } = {}; //this is for storing post creator's usernames

  itemsPerPage = 3;
  currentPage = 1;
  isLoading = false;
  loadedAllPosts = false;

  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private avatarService: AvatarService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private createPostService: CreatePostService,
  ){
    this.avatarService.getUserProfile()?.subscribe((data)=>{
      this.profile = data;
      this.imageUrl = data['imageUrl'] || '../../assets/default-profile-picture.png';
      console.log(this.profile);
    });

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.email = user.email;
        this.uid = user.uid;

        this.userService.getUserById(this.uid).subscribe(user => {
          this.username = user.username;
        });
        
        this.userService.getUserById(this.uid).subscribe(user=>{
          this.dateOfBirth = user.dateOfBirth;
        });

        this.loadNextPage();
      }  
    }); 
  }

  ngOnInit(){
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

  async changeImage(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });
    console.log(image);

    if(image){
      const loading = await this.loadingController.create();
      await loading.present;
      const result = await this.avatarService.uploadImage(image);
      loading.dismiss();

      if(!result){
       this.alertPopup('Upload failed', 'A problem occured');
      }
    }
  }

  redirectToFriendsPage(){
    this.router.navigateByUrl('/friends', {replaceUrl: true});
  }

  redirectToCreatePostPage(){
    this.router.navigateByUrl('/create-post', {replaceUrl: true});
  }

  
  async loadNextPage(event?: any) {
    if (this.isLoading) return;

    const loading = await this.loadingController.create({
      message: 'Loading...',
      spinner: 'bubbles'
    });
    await loading.present();

    try {
      //loading
      console.log(this.uid);
      this.isLoading = true;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;

      const newPosts = await this.createPostService.getUserPosts(
        startIndex,
        endIndex,
        this.uid
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
      const images = await this.createPostService.getPostImages(postId, this.uid);
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

  //Delete posts
  async deletePost(postId: string) {
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
              const isDeleted = await this.createPostService.deletePost(postId, this.uid);

              if (isDeleted) {
                // Remove the deleted post from the userPosts array
                this.userPosts = this.userPosts.filter((post) => post.id !== postId);
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
