import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendProfilePage } from './friend-profile.page';

const routes: Routes = [
  {
    path: '',
    component: FriendProfilePage,
    children: [
      {
        path: 'friend-profile-posts/:friendUid',
        loadChildren: () => import('../friend-profile-posts/friend-profile-posts.module').then(m => m.FriendProfilePostsPageModule)
      },
      {
        path: 'friend-profile-trainings/:friendUid',
        loadChildren: () => import('../friend-profile-trainings/friend-profile-trainings.module').then(m => m.FriendProfileTrainingsPageModule)
      },
      {
        path: '',
        redirectTo: '/friend-profile/friend-profile-posts/:friendUid',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendProfilePageRoutingModule {}
