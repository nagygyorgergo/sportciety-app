import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePostsPageRoutingModule } from './home-posts-routing.module';

import { HomePostsPage } from './home-posts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePostsPageRoutingModule
  ],
  declarations: [HomePostsPage]
})
export class HomePostsPageModule {}
