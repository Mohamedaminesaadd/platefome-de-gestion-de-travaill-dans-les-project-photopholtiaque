import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { PasswordFroget } from './pages/auth/password-froget/password-froget';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
     { path: '', component: Login },
     { path: 'login', component: Login },
     { path: 'profile', component: Profile },
     {path: 'forgot-password', component: PasswordFroget },
     
];
