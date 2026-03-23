import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf, RouterLink],
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'], // CORRIGÉ
})
export class Login {
  loginData = { username: '', password: '' };
  errorMessage = '';

  constructor(private auth: Auth, private router: Router) {}

  // =================== SUBMIT LOGIN ===================
  onSubmit(loginForm: NgForm) {
    if (!this.isValidUsername(this.loginData.username)) {
      this.errorMessage = 'Username invalide';
      return;
    }

    if (!this.isValidPassword(this.loginData.password)) {
      this.errorMessage = 'Mot de passe invalide';
      return;
    }

    this.auth.login(this.loginData.username, this.loginData.password).subscribe({
      next: (res) => {
        // ✅ sauvegarder le token
        this.auth.saveToken(res.token);

        // ✅ récupérer le rôle depuis JWT
        const role = this.auth.getUserRole();
        console.log("ROLE =", role);

        // 🚀 redirection selon rôle
        if (role === 'ADMIN') {
          this.router.navigate(['/admin-profil']);
        } else if (role === 'DIRECTOR') {
          this.router.navigate(['/director-profil']);
        } else if (role === 'TECHNICIAN') {
          this.router.navigate(['/techninician-profil']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Échec de connexion';
      }
    });
  }

  // =================== VALIDATIONS ===================
  isValidUsername(username: string): boolean {
    if (!username) return false;
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return usernameRegex.test(username);
  }

  isValidPassword(password: string): boolean {
    return !!(password && password.length >= 8);
  }

  // =================== SOCIAL LOGIN ===================
  onGoogleLogin(): void {
    console.log('Google login clicked');
    // Exemple : this.auth.loginWithGoogle()
  }

  onFacebookLogin(): void {
    console.log('Facebook login clicked');
    // Exemple : this.auth.loginWithFacebook()
  }
}