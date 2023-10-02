import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';
import { throwIfEmpty } from 'rxjs';
import { AuthService } from '../../services/auth.service'; 
import { AvatarService } from '../../services/avatar.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: any;
  username: string |any;
  email: string | any;
  dateOfBirth: any;
  uid: any;
  imageUrl: string = '../../assets/default-profile-picture.png';

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private avatarService: AvatarService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
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
          this.dateOfBirth=user.dateOfBirth;
        });
      }  
    });
    
  }

  ngOnInit(){
    //console.log("Eredmeny: "+this.email);
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
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'Problem volt sajna',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }

  redirectToFriendsPage(){
    this.router.navigateByUrl('/friends', {replaceUrl: true});
  }

}  