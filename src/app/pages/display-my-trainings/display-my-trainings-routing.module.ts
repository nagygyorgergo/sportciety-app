import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisplayMyTrainingsPage } from './display-my-trainings.page';

const routes: Routes = [
  {
    path: '',
    component: DisplayMyTrainingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisplayMyTrainingsPageRoutingModule {}
