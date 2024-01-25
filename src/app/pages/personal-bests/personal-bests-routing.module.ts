import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonalBestsPage } from './personal-bests.page';

const routes: Routes = [
  {
    path: '',
    component: PersonalBestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalBestsPageRoutingModule {}
