import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <div class="hero-section">
        <h1>Common Queue</h1>
        <p class="hero-subtitle">Smart Queue Management System</p>
        <p class="hero-description">
          Skip the wait, join queues remotely and get real-time updates on your position.
          Perfect for clinics, restaurants, service centers, and more.
        </p>

        <div class="action-buttons">
          <button mat-raised-button color="primary" routerLink="/businesses">
            <mat-icon>search</mat-icon>
            Find Businesses
          </button>
          <button mat-raised-button color="accent" routerLink="/customer/register">
            <mat-icon>person_add</mat-icon>
            Join Queue
          </button>
        </div>
      </div>

      <div class="features-section">
        <h2>Why Use Common Queue?</h2>
        <div class="features-grid">
          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>schedule</mat-icon>
              <mat-card-title>Real-time Updates</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              Get live updates on your queue position and estimated wait time.
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon mat-card-avatar>smartphone</mat-icon>
            <mat-card-header>
              <mat-card-title>Remote Queue Joining</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              Join queues from anywhere and arrive just in time for your turn.
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon mat-card-avatar>notifications</mat-icon>
            <mat-card-header>
              <mat-card-title>Smart Notifications</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              Receive notifications when your turn is approaching via email or SMS.
            </mat-card-content>
          </mat-card>

          <mat-card class="feature-card">
            <mat-icon mat-card-avatar>business</mat-icon>
            <mat-card-header>
              <mat-card-title>For Businesses</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              Manage customer flow efficiently with our business dashboard.
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="cta-section">
        <mat-card>
          <mat-card-content>
            <h3>Ready to skip the wait?</h3>
            <p>Start using Common Queue today and transform your waiting experience.</p>
            <button mat-raised-button color="primary" routerLink="/businesses">
              Get Started
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .hero-section {
      text-align: center;
      margin-bottom: 60px;
    }

    .hero-section h1 {
      font-size: 3rem;
      margin-bottom: 16px;
      color: #3f51b5;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      color: #666;
      margin-bottom: 20px;
    }

    .hero-description {
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto 40px;
      line-height: 1.6;
    }

    .action-buttons {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .action-buttons button {
      padding: 12px 24px;
    }

    .features-section {
      margin-bottom: 60px;
    }

    .features-section h2 {
      text-align: center;
      margin-bottom: 40px;
      color: #333;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .feature-card {
      text-align: center;
      height: 100%;
    }

    .feature-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #3f51b5;
    }

    .cta-section {
      text-align: center;
    }

    .cta-section mat-card {
      background: linear-gradient(135deg, #3f51b5, #673ab7);
      color: white;
    }

    .cta-section h3 {
      margin-bottom: 16px;
    }

    .cta-section button {
      margin-top: 20px;
      background-color: white;
      color: #3f51b5;
    }

    @media (max-width: 768px) {
      .hero-section h1 {
        font-size: 2rem;
      }

      .action-buttons {
        flex-direction: column;
        align-items: center;
      }

      .action-buttons button {
        width: 200px;
      }
    }
  `]
})
export class HomeComponent {}
