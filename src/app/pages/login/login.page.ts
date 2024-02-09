import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup |any;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    
  ) {}

  ngOnInit() {
    this.credentials = this. fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  getEmail(){
    return this.credentials.get('email');
  }

  getPassword(){
    return this.credentials.get('password');
  }

  async login(): Promise<void> {
    const loading = await this.loadingController.create();
    await loading.present();
  
    try {
      const email = this.getEmail()?.value;
      const password = this.getPassword()?.value;
  
      if (email && password) {
        const user = await this.authService.login(this.credentials.value);
  
        if (user) {
          if (user.emailVerified) {
            // Proceed with login
            console.log('User logged in successfully.');
            // Redirect the user to the desired page
            this.router.navigateByUrl('/', {replaceUrl: true});
          } else {
            this.showAlert('Email Verification Required', 'Please verify your email before logging in.');
          }
        } else {
          this.showAlert('Login failed', 'Invalid email or password.');
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      await loading.dismiss();
    }
  }

  async showAlert(header:any, message:any){
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  redirectToSignup(){
    this.router.navigateByUrl('/signup', {replaceUrl: true});
  }

  redirectToForgotPassword(){
    this.router.navigateByUrl('/forgot-password', {replaceUrl: true});
  }
  

}
