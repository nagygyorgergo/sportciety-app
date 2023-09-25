import { Component, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IonMenu, MenuController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  public appPages = [
    { title: 'Trending Movies', url: 'movies', icon: 'film' },
    { title: 'Profile', url: 'profile', icon: 'person' },
    { title: 'Plan new training', url: 'plan-training', icon: 'barbell' },
    { title: 'View my trainings', url: 'display-my-trainings', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
  ];
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  email: any;
  @ViewChild('menu', { static: true }) menu: IonMenu | any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    ) {
      this.afAuth.authState.subscribe(user=>{
        this.email=user?.email;
      });
    }

  async logout(){
    this.afAuth.authState.subscribe(user =>{
      if(user){
        console.log(user.email);
        console.log("logging out");
      }
      else{
        console.log("not logged in");
      }
    });
    await this.authService.logout();
    this.menu.close();
    this.router.navigateByUrl('login', {replaceUrl: true});
  }
}
