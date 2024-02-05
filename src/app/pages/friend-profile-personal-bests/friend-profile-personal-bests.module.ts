import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendProfilePersonalBestsPageRoutingModule } from './friend-profile-personal-bests-routing.module';

import { FriendProfilePersonalBestsPage } from './friend-profile-personal-bests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendProfilePersonalBestsPageRoutingModule
  ],
  declarations: [FriendProfilePersonalBestsPage]
})
export class FriendProfilePersonalBestsPageModule {}
