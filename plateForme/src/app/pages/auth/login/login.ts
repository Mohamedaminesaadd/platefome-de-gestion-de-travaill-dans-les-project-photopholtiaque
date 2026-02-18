import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
    loginData = {
    username: '',
    password: ''
  };

  onSubmit(): void {
    console.log('Login attempted with:', this.loginData);
    // Ajoutez ici votre logique d'authentification
    // Exemple : this.authService.login(this.loginData).subscribe(...)
  }

  onGoogleLogin(): void {
    console.log('Google login clicked');
    // Ajoutez ici votre logique de connexion Google
    // Exemple : this.authService.loginWithGoogle()
  }

  onFacebookLogin(): void {
    console.log('Facebook login clicked');
    // Ajoutez ici votre logique de connexion Facebook
    // Exemple : this.authService.loginWithFacebook()
  }
}
