import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPasswordPageRoutingModule } from './forgot-password-routing.module';

import { ForgotPasswordPage } from './forgot-password.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPasswordPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ForgotPasswordPage]
})
export class ForgotPasswordPageModule {}
