import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonalBestsPageRoutingModule } from './personal-bests-routing.module';

import { PersonalBestsPage } from './personal-bests.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonalBestsPageRoutingModule, 
    ReactiveFormsModule
  ],
  declarations: [PersonalBestsPage]
})
export class PersonalBestsPageModule {}
