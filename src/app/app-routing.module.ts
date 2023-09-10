import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthComponent,
  CreatePostComponent,
  DashboardComponent,
  HomepageComponent,
  NotfoundComponent,
  PostComponent,
  RecoveryComponent,
  RegisterComponent,
  SettingsComponent,
  VerifyComponent,
} from './views';
import { isUserAuth, isUserAuthed } from './services';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'sign_up',
    component: RegisterComponent,
    canActivate: [isUserAuthed],
  },
  {
    path: 'sign_in',
    component: AuthComponent,
    canActivate: [isUserAuthed],
  },
  {
    path: 'recovery',
    component: RecoveryComponent,
    canActivate: [isUserAuthed],
  },
  {
    path: 'verify',
    component: VerifyComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [isUserAuth],
  },
  {
    path: 'create_post',
    component: CreatePostComponent,
    canActivate: [isUserAuth],
  },
  {
    path: 'post/:id',
    component: PostComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [isUserAuth],
  },
  {
    path: '404',
    component: NotfoundComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
