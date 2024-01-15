import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeTrainingsPageRoutingModule } from './home-trainings-routing.module';

import { HomeTrainingsPage } from './home-trainings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeTrainingsPageRoutingModule
  ],
  declarations: [HomeTrainingsPage]
})
export class HomeTrainingsPageModule {}
