import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Userdata } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  credentials: FormGroup|any;
  newUser!: Userdata;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}
 
  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      date: ['2000-01-01', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      imageUrl: '../../assets/default-profile-picture.png'
    }, { validators: this.passwordMatchValidator });
  }
  
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
  
    return password === confirmPassword ? null : { mismatch: true };
  }
  
  getUsername(){
    return this.credentials.get('username');
  }

  getEmail(){
    return this.credentials.get('email');
  }

  getPassword(){
    return this.credentials.get('password');
  }

  async signup(): Promise<void> {
    const loading = await this.loadingController.create();
    await loading.present();
  
    try {
      const email = this.getEmail()?.value;
      const password = this.getPassword()?.value;
  
      if (email && password) {
        const cred = await this.authService.register(email, password);
  
        if (cred) {
          const user: Userdata = {
            uid: cred.uid,
            email: email,
            username: this.getUsername()?.value,
            dateOfBirth: this.credentials.get('date')?.value,
            friendUids: [],
            imageUrl: '../../assets/default-profile-picture.png'
          };
  
          await this.userService.createUser(user);
          console.log('User added successfully.');
        } else {
          this.showAlert('Registration failed', 'Try again');
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      await loading.dismiss();
      this.router.navigateByUrl('/', { replaceUrl: true });
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

  redirectToLogin(){
    this.router.navigateByUrl('/login', {replaceUrl: true});
  }

}
