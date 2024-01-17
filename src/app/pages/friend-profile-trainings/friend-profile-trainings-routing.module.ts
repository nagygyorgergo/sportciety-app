import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendProfileTrainingsPage } from './friend-profile-trainings.page';

const routes: Routes = [
  {
    path: '',
    component: FriendProfileTrainingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendProfileTrainingsPageRoutingModule {}
