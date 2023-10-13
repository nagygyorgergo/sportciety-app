import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { Post } from 'src/app/models/post.model';
import { CreatePostService } from 'src/app/services/create-post.service';

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

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private createPostService: CreatePostService,
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
 
  createPost() {
    this.createPostService.createPost(this.postText)
      .then(docRef => {
        console.log('Post created with ID: ' + docRef.id);
        this.createdPostId = docRef.id;
      })
      .catch(error => {
        console.error('Error creating post:', error);
      })
      .finally(() => {
        // Set isPostCreating back to false when post creation is complete
        this.isPostCreated = true;
      });;
  }

  
  async uploadImage(){
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
      const result = await this.createPostService.uploadImage(image, this.createdPostId);
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
    this.redirectToProfile();
  }

  
  redirectToProfile(){
    this.router.navigateByUrl('/profile', {replaceUrl: true});
  }
 
}
