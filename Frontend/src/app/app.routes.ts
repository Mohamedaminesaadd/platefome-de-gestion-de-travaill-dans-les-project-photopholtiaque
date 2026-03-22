import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { PasswordForget } from './pages/auth/password-forget/password-forget';
import { Profile } from './pages/profile/profile';
import { ResetPassword } from './pages/auth/reset-password/reset-password';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'profile', component: Profile },
  { path: 'forget-password', component: PasswordForget },
  { path: 'reset/:token', component: ResetPassword }, 
];
