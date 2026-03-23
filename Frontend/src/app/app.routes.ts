import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { PasswordForget } from './pages/auth/password-forget/password-forget';
import { ResetPassword } from './pages/auth/reset-password/reset-password';
import { Profildirector } from './pages/director/profildirector/profildirector';
import { Profiltechnician } from './pages/technincian/profiltechnician/profiltechnician';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'forget-password', component: PasswordForget },
  { path: 'reset/:token', component: ResetPassword }, 
  {path:'admin-profil',component:Profildirector },
  {path:'techninician-profil',component:Profiltechnician},
  {path:'director-profil',component:Profildirector} 
];
