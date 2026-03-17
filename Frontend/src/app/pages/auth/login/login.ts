import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf,RouterLink],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
     loginData = { username: '', password: '' };
      errorMessage = '';

    constructor(private authService: Auth, private router: Router) {}

  onSubmit(loginForm: NgForm) {
    if (loginForm.invalid) return;

    // Appel du service Auth pour login
    this.authService.login(this.loginData.username, this.loginData.password)
      .subscribe({
        next: (res) => {
          // ✅ stocker le JWT
          this.authService.saveToken(res.token);
          // ✅ rediriger vers profile
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Login failed';
        }
      });
  }

  isValidUsername(username: string): boolean {
    if (!username) return false;
    // Username : minimum 3 caractères, lettres, chiffres et underscore autorisés
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return usernameRegex.test(username);
  }

  isValidPassword(password: string): boolean {
    // Mot de passe : minimum 8 caractères
    return !!(password && password.length >= 8);
  }

  onGoogleLogin(): void {
    console.log('Google login clicked');
    // Exemple : this.authService.loginWithGoogle()
  }

  onFacebookLogin(): void {
    console.log('Facebook login clicked');
    // Exemple : this.authService.loginWithFacebook()
  }
}
