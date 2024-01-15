import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePostsPage } from './home-posts.page';

const routes: Routes = [
  {
    path: '',
    component: HomePostsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePostsPageRoutingModule {}
