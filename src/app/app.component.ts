import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController, IonMenu, IonRouterOutlet, MenuController, NavController, Platform } from '@ionic/angular';
import { Subscription, async } from 'rxjs';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit{
  public appPages = [
    { title: 'Home', url: 'home', icon: 'home' },
    { title: 'Profile', url: 'profile', icon: 'person' },
    { title: 'Plan new training', url: 'plan-training', icon: 'barbell' },
    { title: 'View my trainings', url: 'display-my-trainings', icon: 'archive' },
    /* { title: 'Trash', url: '/folder/trash', icon: 'trash' }, */
  ];

  private afAuthSubscribtion: Subscription | null = null;
  
  @ViewChild('menu', { static: true }) menu: IonMenu | any;
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet | any;
  email: any;
  themeToggle = false;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private platform: Platform,
    private location: Location,
    private alertController: AlertController,
    ) {
      this.afAuth.authState.subscribe(user=>{
        this.email=user?.email;
      });
  }

  ngOnInit() {
    this.backButtonEvent();

    if(Capacitor.platform !== 'web'){
      // Request permission to use push notifications
      // iOS will prompt user and return if they granted permission or not
      // Android will just grant without prompting
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });

      PushNotifications.addListener('registration', (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          console.log('Push received: ' + JSON.stringify(notification));
        },
      );

      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          const data = notification.notification.data;
          console.log('Push action performed: ' + JSON.stringify(notification));
          if(data.detailsId){
            this.router.navigate(['/friends']);
          }
        },
      );
    }
  
  }

  ngOnDestroy(): void{
    if(this.afAuthSubscribtion){
      this.afAuthSubscribtion.unsubscribe();
    }
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      console.log('Back button pressed on 0 parameter');
      // Check if the current page is the home page
      if (!this.routerOutlet.canGoBack()) {
        // If on the home page and it's not the root page, exit the app
        this.backButtonAlert();
      } else {
        // If not on the home page or it's the root page, navigate back
        this.location.back();
      }
    });
  }
  
  async backButtonAlert(){
    const alert = await this.alertController.create({
      header: 'Exit',
      message: `Are you sure you wantexit the app?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Close app',
          handler: () => {
            App.exitApp();
          }
        }
      ]
      });
      await alert.present();

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
