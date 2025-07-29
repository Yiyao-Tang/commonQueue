import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-business-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card class="login-card">
        <mat-card-header>
          <div mat-card-avatar class="login-avatar">
            <mat-icon>business</mat-icon>
          </div>
          <mat-card-title>Business Login</mat-card-title>
          <mat-card-subtitle>
            Access your queue management dashboard
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email Address</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput formControlName="email" type="email" required>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input matInput formControlName="password"
                     [type]="hidePassword ? 'password' : 'text'" required>
              <button mat-icon-button matSuffix type="button"
                      (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility' : 'visibility_off' }}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>
          </form>

          <div class="demo-credentials" *ngIf="!loading">
            <h4>Demo Credentials</h4>
            <p><strong>Email:</strong>admin&#64;sgclinic.com</p>
            <p><strong>Password:</strong>newpassword</p>
            <button mat-button color="accent" (click)="fillDemoCredentials()">
              <mat-icon>auto_fix_high</mat-icon>
              Use Demo Credentials
            </button>
          </div>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button type="button" routerLink="/home">
            <mat-icon>arrow_back</mat-icon>
            Back to Home
          </button>
          <button mat-raised-button color="primary"
                  [disabled]="loginForm.invalid || loading"
                  (click)="onLogin()">
            <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
            <mat-icon *ngIf="!loading">login</mat-icon>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </mat-card-actions>

        <div class="additional-links">
          <p>Don't have a business account?</p>
          <button mat-button color="primary">
            <mat-icon>business</mat-icon>
            Register Your Business
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 400px;
      margin: 60px auto;
      padding: 20px;
    }

    .login-card {
      width: 100%;
    }

    .login-avatar {
      background-color: #3f51b5;
      color: white;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .demo-credentials {
      background-color: #f0f8ff;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
      text-align: center;
    }

    .demo-credentials h4 {
      margin-bottom: 12px;
      color: #3f51b5;
    }

    .demo-credentials p {
      margin: 4px 0;
      font-size: 14px;
      color: #666;
    }

    .demo-credentials button {
      margin-top: 12px;
    }

    mat-card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    mat-spinner {
      margin-right: 8px;
    }

    .additional-links {
      text-align: center;
      padding: 16px;
      border-top: 1px solid #eee;
      margin-top: 16px;
    }

    .additional-links p {
      margin-bottom: 8px;
      color: #666;
    }
  `]
})
export class BusinessLoginComponent {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  fillDemoCredentials(): void {
    this.loginForm.patchValue({
      email: 'admin@sgclinic.com',
      password: 'newpassword'
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/business-dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Invalid email or password', 'Close', { duration: 5000 });
        console.error('Login error:', error);
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
