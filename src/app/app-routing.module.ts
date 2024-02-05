import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'plan-training',
    loadChildren: () => import('./pages/plan-training/plan-training.module').then( m => m.PlanTrainingPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'display-my-trainings',
    loadChildren: () => import('./pages/display-my-trainings/display-my-trainings.module').then( m => m.DisplayMyTrainingsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'friends',
    loadChildren: () => import('./pages/friends/friends.module').then( m => m.FriendsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'create-post',
    loadChildren: () => import('./pages/create-post/create-post.module').then( m => m.CreatePostPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'friend-profile',
    loadChildren: () => import('./pages/friend-profile/friend-profile.module').then( m => m.FriendProfilePageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'personal-bests',
    loadChildren: () => import('./pages/personal-bests/personal-bests.module').then( m => m.PersonalBestsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'personal-best-details/:exerciseId',
    loadChildren: () => import('./pages/personal-best-details/personal-best-details.module').then(m => m.PersonalBestDetailsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'friend-profile-personal-best-details/:exerciseId',
    loadChildren: () => import('./pages/friend-profile-personal-best-details/friend-profile-personal-best-details.module').then( m => m.FriendProfilePersonalBestDetailsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'error/:message',
    loadChildren: () => import('./pages/error/error.module').then( m => m.ErrorPageModule)
  },
  { 
    path: '**', 
    redirectTo: 'error', 
    pathMatch: 'full' 
  },

  /* {
    path: 'friend-profile-personal-bests',
    loadChildren: () => import('./pages/friend-profile-personal-bests/friend-profile-personal-bests.module').then( m => m.FriendProfilePersonalBestsPageModule)
  }, */

  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
