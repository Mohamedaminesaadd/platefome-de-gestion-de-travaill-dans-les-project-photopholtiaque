import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth.js'; // ← .js retiré

@Component({
  selector: 'app-password-forget',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './password-forget.html',
  styleUrl: './password-forget.css',
})
export class PasswordForget {
  email        = '';
  emailSent    = false;
  errorMessage = '';
  isLoading    = false; // ← loading state

  constructor(private auth: Auth) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.isLoading    = true;
    this.errorMessage = '';

    this.auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.emailSent = true;
        this.isLoading = false;
        form.resetForm();
      },
      error: (err) => {
        // ← apostrophes corrigées avec backtick
        this.errorMessage = err.error?.message ?? `Erreur lors de l'envoi de l'email`;
        this.isLoading    = false;
      }
    });
  }
}