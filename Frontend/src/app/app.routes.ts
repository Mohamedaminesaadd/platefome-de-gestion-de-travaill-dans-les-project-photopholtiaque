import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { PasswordFroget } from './pages/auth/password-froget/password-froget';

export const routes: Routes = [
     { path: '', component: Login },
     { path: 'login', component: Login },
     {path: 'forgot-password', component: PasswordFroget }
];
