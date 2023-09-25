import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanTrainingPageRoutingModule } from './plan-training-routing.module';

import { PlanTrainingPage } from './plan-training.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanTrainingPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [PlanTrainingPage]
})
export class PlanTrainingPageModule {}
