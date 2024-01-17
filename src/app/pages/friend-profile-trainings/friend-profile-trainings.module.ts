import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendProfileTrainingsPageRoutingModule } from './friend-profile-trainings-routing.module';

import { FriendProfileTrainingsPage } from './friend-profile-trainings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendProfileTrainingsPageRoutingModule
  ],
  declarations: [FriendProfileTrainingsPage]
})
export class FriendProfileTrainingsPageModule {}
