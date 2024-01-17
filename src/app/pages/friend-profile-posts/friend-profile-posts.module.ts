import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendProfilePostsPageRoutingModule } from './friend-profile-posts-routing.module';

import { FriendProfilePostsPage } from './friend-profile-posts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendProfilePostsPageRoutingModule
  ],
  declarations: [FriendProfilePostsPage]
})
export class FriendProfilePostsPageModule {}
