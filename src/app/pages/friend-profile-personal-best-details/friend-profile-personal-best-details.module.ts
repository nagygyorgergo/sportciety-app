import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendProfilePersonalBestDetailsPageRoutingModule } from './friend-profile-personal-best-details-routing.module';

import { FriendProfilePersonalBestDetailsPage } from './friend-profile-personal-best-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendProfilePersonalBestDetailsPageRoutingModule
  ],
  declarations: [FriendProfilePersonalBestDetailsPage]
})
export class FriendProfilePersonalBestDetailsPageModule {}
