import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-password-froget',
   standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './password-froget.html',
  styleUrl: './password-froget.css',
})
export class PasswordFroget {
  email: string = '';
  emailSent: boolean = false;

  constructor(private http: HttpClient) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.http.post('http://localhost:3000/api/auth/forgot-password', {
      email: this.email
    }).subscribe({
      next: () => {
        this.emailSent = true;
        form.resetForm();
      },
      error: () => {
        alert('Erreur lors de l’envoi de l’email');
      }
    });
  }

}
