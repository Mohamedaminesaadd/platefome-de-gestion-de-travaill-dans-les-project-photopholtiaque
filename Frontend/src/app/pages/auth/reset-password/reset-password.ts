import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';        // ✅ ajouter
import { HttpClientModule } from '@angular/common/http'; // ✅ ajouter
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-reset-password',
  standalone:true,
    imports: [
    FormsModule,   
    CommonModule,   
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {

  password: string = '';
  confirmPassword: string = '';
  resetSuccess: boolean = false;
  errorMessage: string = '';
  loading: boolean = false;
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // ✅ récupère le token depuis l'URL /reset/:token
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit(form: NgForm) {
    if (form.invalid || this.password !== this.confirmPassword) return;

    this.loading = true;
    this.errorMessage = '';

    this.http.post('http://localhost:3000/api/reset-password', {
      token: this.token,
      newPassword: this.password
    }).subscribe({
      next: () => {
        this.resetSuccess = true;
        this.loading = false;
        // ✅ redirect vers login après 2 secondes
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Token invalide ou expiré';
        this.loading = false;
      }
    });
  }
}
