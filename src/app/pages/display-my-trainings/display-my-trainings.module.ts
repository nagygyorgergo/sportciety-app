import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisplayMyTrainingsPageRoutingModule } from './display-my-trainings-routing.module';

import { DisplayMyTrainingsPage } from './display-my-trainings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisplayMyTrainingsPageRoutingModule,
  ],
  declarations: [DisplayMyTrainingsPage]
})
export class DisplayMyTrainingsPageModule {}
