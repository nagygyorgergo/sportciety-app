import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonalBestDetailsPage } from './personal-best-details.page';

const routes: Routes = [
  {
    path: '',
    component: PersonalBestDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalBestDetailsPageRoutingModule {}
