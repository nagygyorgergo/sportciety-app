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
        path: 'friend-profile-personal-bests/:friendUid',
        loadChildren: () => import('../friend-profile-personal-bests/friend-profile-personal-bests.module').then(m => m.FriendProfilePersonalBestsPageModule)
      },
      /* {
        path: 'friend-profile-personal-best-details/:exerciseId',
        loadChildren: () => import('../friend-profile-personal-best-details/friend-profile-personal-best-details.module').then(m => m.FriendProfilePersonalBestDetailsPageModule)
      }, */
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
