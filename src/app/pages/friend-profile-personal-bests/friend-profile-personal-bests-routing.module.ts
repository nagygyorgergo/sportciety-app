import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendProfilePersonalBestsPage } from './friend-profile-personal-bests.page';

const routes: Routes = [
  {
    path: '',
    component: FriendProfilePersonalBestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendProfilePersonalBestsPageRoutingModule {}
