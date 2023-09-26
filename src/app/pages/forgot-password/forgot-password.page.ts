import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  email: string = '';
  resetForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private alertController: AlertController,
    private router: Router
    ) {}

  ngOnInit() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async sendPasswordResetEmail() {
    if (this.resetForm.valid) {
      const email = this.resetForm.value.email;
      const success = await this.authService.forgotPassword(email);
      if (success) {
        console.log("Email sent successfully");
        this.showAlert('Email sent successfully', 'Check your inbox');
      } else {
        console.log("Email couldn't be sent");
        this.showAlert("Email couldn't be sent", "check if email is valid");
      }
    } else {
      console.log("Email invalid");
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
