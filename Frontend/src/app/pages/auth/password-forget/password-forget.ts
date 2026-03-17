import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth.js'; // ton service Auth

@Component({
  selector: 'app-password-forget',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './password-forget.html',
  styleUrl: './password-forget.css',
})
export class PasswordForget {
  email: string = '';
  emailSent: boolean = false;
  message: string = '';

  constructor(private auth: Auth) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    // Appel au service Auth
    this.auth.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.emailSent = true;
        this.message = 'Email de réinitialisation envoyé !';
        form.resetForm();
      },
      error: (err) => {
        this.message = err.error?.message || 'Erreur lors de l’envoi de l’email';
      }
    });
  }
}