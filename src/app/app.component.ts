import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IonMenu, MenuController } from '@ionic/angular';
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
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
  ];
  
  @ViewChild('menu', { static: true }) menu: IonMenu | any;
  email: any;
  themeToggle = false;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
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
