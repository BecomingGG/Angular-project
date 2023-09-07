import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthComponent,
  HomepageComponent,
  NotfoundComponent,
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
    path: 'settings',
    component: SettingsComponent,
    canActivate: [isUserAuth],
  },
  {
    path: 'verify',
    component: VerifyComponent,
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
