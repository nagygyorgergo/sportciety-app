import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonalBestDetailsPageRoutingModule } from './personal-best-details-routing.module';

import { PersonalBestDetailsPage } from './personal-best-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonalBestDetailsPageRoutingModule,
    ReactiveFormsModule

  ],
  declarations: [PersonalBestDetailsPage]
})
export class PersonalBestDetailsPageModule {}
