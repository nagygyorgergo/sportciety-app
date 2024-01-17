import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendProfilePostsPage } from './friend-profile-posts.page';

const routes: Routes = [
  {
    path: '',
    component: FriendProfilePostsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendProfilePostsPageRoutingModule {}
