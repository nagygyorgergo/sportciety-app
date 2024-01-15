import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'home-posts',
        loadChildren: () => import('../home-posts/home-posts.module').then(m => m.HomePostsPageModule)
      },
      {
        path: 'home-trainings',
        loadChildren: () => import('../home-trainings/home-trainings.module').then(m => m.HomeTrainingsPageModule)
      },
      {
        path: '',
        redirectTo: '/home/home-posts',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
