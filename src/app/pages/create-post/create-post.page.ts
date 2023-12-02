import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { Post } from 'src/app/models/post.model';
import {PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {
  uid: string = '';
  postText: string = '';
  createdPostId: string = ''; //Used to make image name the same as the post id.
  isPostCreated: boolean = false; //Only able to upload image if post exists

  image!: Photo;
  imageLocalPath = '';

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private postService: PostService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        /* console.log(this.uid) */
      }  
    });
    
  }

  // Check if the textarea is empty or contains only whitespace
  isPostTextEmpty() {
    return !this.postText || this.postText.trim() === '';
  }
  
  async createPost() {
    try {
      const postId = await this.postService.createPost(this.postText);
      
      if (postId) {
        console.log('Post created with ID: ' + postId);
        this.createdPostId = postId;
        this.isPostCreated = true;
  
        await this.uploadImage(this.image);
        console.log(this.image);
        this.redirectToProfile();
      } else {
        console.error('Error creating post: Post ID is null');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      this.isPostCreated = true;
    }
  }

  async selectImage() {
    this.image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
  
    if (this.image) {
      this.imageLocalPath = 'data:image/png;base64,' + this.image.base64String;
      console.log('Base64String: ' + this.image.base64String);
    }
  }
  

  async uploadImage(image: Photo){
    if(image){
      const loading = await this.loadingController.create();
      await loading.present;
      const result = await this.postService.uploadImage(image, this.createdPostId);
      loading.dismiss();

      if(!result){
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'Problem volt sajna',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }

  
  redirectToProfile(){
    this.router.navigateByUrl('/profile', {replaceUrl: true});
  }
 
}
