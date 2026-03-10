import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Signin } from './pages/signin/signin';
import { Signup } from './pages/signup/signup';
import { ActivateAccount } from './pages/activate-account/activate-account';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: Signup },
  { path: 'signin', component: Signin},
  { path: 'activate-account', component: ActivateAccount}
];