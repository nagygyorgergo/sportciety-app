import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController, IonMenu, IonRouterOutlet, MenuController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';
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
    private navCtrl: NavController
    ) {
      this.afAuth.authState.subscribe(user=>{
        this.email=user?.email;
      });
  }

  ngOnInit() {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Initialize the dark theme based on the initial
    // value of the prefers-color-scheme media query
    this.initializeDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkTheme(mediaQuery.matches));

    this.backButtonEvent();
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

    /* this.platform.backButton.subscribeWithPriority(100, () => {
      console.log('Back button pressed on 100 parameter');
      // Check if the current page is the home page
      if (!this.routerOutlet.canGoBack()) {
        // If on the home page and it's not the root page, exit the app
        this.backButtonAlert();
      } else {
        // If not on the home page or it's the root page, navigate back
        this.location.back();
      }
    }); */
  }

  /* backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Back button pressed');

      // Check if the current page is the home page
      if (this.navCtrl.length() <= 1) {
        // If on the home page or it's the root page, exit the app
        this.backButtonAlert();
      } else {
        // If not on the home page and there are pages to go back to, navigate back
        this.location.back();
      }
    });
  } */
  

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

  // Check/uncheck the toggle and update the theme based on isDark
  initializeDarkTheme(isDark: boolean) {
    this.themeToggle = isDark;
    this.toggleDarkTheme(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark theme
  toggleChange(event: any) {
    this.toggleDarkTheme(event.detail.checked);
  }

  // Add or remove the "dark" class on the document body
  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
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
