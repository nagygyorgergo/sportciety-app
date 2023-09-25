import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanTrainingPage } from './plan-training.page';

const routes: Routes = [
  {
    path: '',
    component: PlanTrainingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanTrainingPageRoutingModule {}
