import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { Queue } from '../../models/queue.model';
import { QueueService } from '../../services/queue.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-business-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatGridListModule
  ],
  template: `
    <div class="container">
      <div class="dashboard-header">
        <h1>Business Dashboard</h1>
        <p>Manage your queues and monitor performance</p>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div class="dashboard-content" *ngIf="!loading">
        <!-- Quick Stats -->
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>queue</mat-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ totalActiveQueues }}</div>
                  <div class="stat-label">Active Queues</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>people</mat-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ totalWaitingCustomers }}</div>
                  <div class="stat-label">Customers Waiting</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>done_all</mat-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ totalServedToday }}</div>
                  <div class="stat-label">Served Today</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>schedule</mat-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ averageWaitTime }}min</div>
                  <div class="stat-label">Avg Wait Time</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Quick Actions -->
        <div class="actions-section">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <mat-card class="action-card">
              <mat-card-header>
                <mat-card-title>Queue Management</mat-card-title>
                <mat-card-subtitle>Manage your queues and serve customers</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-raised-button color="primary" routerLink="/queue-management/1">
                  <mat-icon>settings</mat-icon>
                  Manage Queues
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="action-card">
              <mat-card-header>
                <mat-card-title>Public Display</mat-card-title>
                <mat-card-subtitle>Show queue status to customers</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-raised-button color="accent" routerLink="/public-display/1">
                  <mat-icon>tv</mat-icon>
                  View Display
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="action-card">
              <mat-card-header>
                <mat-card-title>Create New Queue</mat-card-title>
                <mat-card-subtitle>Set up a new service queue</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-raised-button color="primary">
                  <mat-icon>add</mat-icon>
                  Create Queue
                </button>
              </mat-card-actions>
            </mat-card>

            <mat-card class="action-card">
              <mat-card-header>
                <mat-card-title>Analytics</mat-card-title>
                <mat-card-subtitle>View performance metrics</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions>
                <button mat-raised-button>
                  <mat-icon>analytics</mat-icon>
                  View Analytics
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>

        <!-- Active Queues Overview -->
        <div class="queues-section">
          <h2>Active Queues</h2>
          <div class="queues-grid" *ngIf="queues.length > 0">
            <mat-card *ngFor="let queue of queues" class="queue-overview-card">
              <mat-card-header>
                <mat-card-title>{{ queue.queueName }}</mat-card-title>
                <mat-card-subtitle>{{ queue.queueType }}</mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <div class="queue-stats">
                  <div class="queue-stat">
                    <span class="stat-value">{{ queue.currentNumber }}</span>
                    <span class="stat-label">Current</span>
                  </div>
                  <div class="queue-stat">
                    <span class="stat-value">{{ queue.nextNumber - queue.currentNumber - 1 }}</span>
                    <span class="stat-label">Waiting</span>
                  </div>
                </div>
              </mat-card-content>

              <mat-card-actions>
                <button mat-button routerLink="/queue-management/1">
                  <mat-icon>settings</mat-icon>
                  Manage
                </button>
              </mat-card-actions>
            </mat-card>
          </div>

          <div class="no-queues" *ngIf="queues.length === 0">
            <mat-icon>queue</mat-icon>
            <h3>No Active Queues</h3>
            <p>Create your first queue to get started</p>
            <button mat-raised-button color="primary">
              <mat-icon>add</mat-icon>
              Create Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .dashboard-header h1 {
      margin-bottom: 8px;
      color: #333;
    }

    .dashboard-header p {
      color: #666;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      height: 120px;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
      height: 100%;
    }

    .stat-icon {
      background-color: #3f51b5;
      color: white;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #3f51b5;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
    }

    .actions-section {
      margin-bottom: 40px;
    }

    .actions-section h2 {
      margin-bottom: 20px;
      color: #333;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .action-card {
      height: 140px;
      display: flex;
      flex-direction: column;
    }

    .action-card mat-card-actions {
      margin-top: auto;
    }

    .queues-section h2 {
      margin-bottom: 20px;
      color: #333;
    }

    .queues-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .queue-overview-card {
      height: 160px;
    }

    .queue-stats {
      display: flex;
      justify-content: space-around;
      text-align: center;
      margin: 16px 0;
    }

    .queue-stat {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #3f51b5;
    }

    .no-queues {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-queues mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BusinessDashboardComponent implements OnInit {
  queues: Queue[] = [];
  loading = true;
  totalActiveQueues = 0;
  totalWaitingCustomers = 0;
  totalServedToday = 0;
  averageWaitTime = 0;

  constructor(
    private queueService: QueueService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // In a real app, get business ID from auth service
    const businessId = 1; // Mock business ID

    this.queueService.getBusinessQueues(businessId).subscribe({
      next: (queues) => {
        this.queues = queues;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }

  private calculateStats(): void {
    this.totalActiveQueues = this.queues.filter(q => q.isActive).length;
    this.totalWaitingCustomers = this.queues.reduce((total, queue) =>
      total + (queue.nextNumber - queue.currentNumber - 1), 0);
    this.totalServedToday = Math.floor(Math.random() * 50) + 10; // Mock data
    this.averageWaitTime = this.queues.length > 0 ?
      Math.round(this.queues.reduce((total, queue) => total + queue.avgServiceTimeMinutes, 0) / this.queues.length) : 0;
  }
}
