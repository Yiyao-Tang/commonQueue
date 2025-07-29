import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QueueEntry, QueueEntryStatus } from '../../models/queue-entry.model';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <div class="dashboard-header">
        <h1>My Queue Status</h1>
        <p>Track your position and get real-time updates</p>
      </div>

      <div class="active-queues" *ngIf="activeQueues.length > 0">
        <h2>Current Queue Position</h2>
        <mat-card *ngFor="let entry of activeQueues" class="queue-entry-card">
          <mat-card-header>
            <div mat-card-avatar class="queue-avatar">
              <mat-icon>queue</mat-icon>
            </div>
            <mat-card-title>{{ entry.queueName }}</mat-card-title>
            <mat-card-subtitle>{{ entry.businessName }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="position-display">
              <div class="position-number">{{ entry.queueNumber }}</div>
              <div class="position-info">
                <mat-chip [ngClass]="getStatusClass(entry.status)">
                  <mat-icon>{{ getStatusIcon(entry.status) }}</mat-icon>
                  {{ getStatusText(entry.status) }}
                </mat-chip>
                <div class="position-details">
                  <div class="detail-item">
                    <mat-icon>people</mat-icon>
                    <span>Position: {{ entry.positionInQueue }}</span>
                  </div>
                  <div class="detail-item" *ngIf="entry.estimatedWaitTimeMinutes">
                    <mat-icon>schedule</mat-icon>
                    <span>Est. wait: {{ entry.estimatedWaitTimeMinutes }} min</span>
                  </div>
                  <div class="detail-item">
                    <mat-icon>access_time</mat-icon>
                    <span>Joined: {{ formatTime(entry.joinedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button routerLink="/queue/{{ entry.queueId }}">
              <mat-icon>visibility</mat-icon>
              View Queue
            </button>
            <button mat-button color="warn"
                    *ngIf="entry.status === 'WAITING'"
                    (click)="cancelEntry(entry)">
              <mat-icon>cancel</mat-icon>
              Cancel
            </button>
            <button mat-button
                    *ngIf="entry.status === 'SERVED'"
                    routerLink="/feedback/{{ entry.id }}">
              <mat-icon>feedback</mat-icon>
              Rate Experience
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="no-active-queues" *ngIf="activeQueues.length === 0 && !loading">
        <mat-icon>queue</mat-icon>
        <h3>No Active Queue Entries</h3>
        <p>You're not currently in any queues</p>
        <button mat-raised-button color="primary" routerLink="/businesses">
          <mat-icon>search</mat-icon>
          Find Businesses
        </button>
      </div>

      <div class="recent-history" *ngIf="recentHistory.length > 0">
        <h2>Recent History</h2>
        <div class="history-list">
          <mat-card *ngFor="let entry of recentHistory" class="history-card">
            <mat-card-content>
              <div class="history-item">
                <div class="history-info">
                  <h4>{{ entry.queueName }}</h4>
                  <p>{{ entry.businessName }}</p>
                  <span class="history-date">{{ formatDate(entry.joinedAt) }}</span>
                </div>
                <div class="history-status">
                  <mat-chip [ngClass]="getStatusClass(entry.status)">
                    {{ getStatusText(entry.status) }}
                  </mat-chip>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button
                      *ngIf="entry.status === 'SERVED'"
                      routerLink="/feedback/{{ entry.id }}">
                <mat-icon>feedback</mat-icon>
                Rate
              </button>
              <button mat-button routerLink="/business/{{ entry.queueId }}">
                <mat-icon>refresh</mat-icon>
                Join Again
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
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

    .active-queues h2,
    .recent-history h2 {
      margin-bottom: 20px;
      color: #333;
    }

    .queue-entry-card {
      margin-bottom: 24px;
      border: 2px solid #3f51b5;
    }

    .queue-avatar {
      background-color: #3f51b5;
      color: white;
    }

    .position-display {
      display: flex;
      align-items: center;
      gap: 32px;
      margin: 20px 0;
    }

    .position-number {
      font-size: 4rem;
      font-weight: bold;
      color: #3f51b5;
      min-width: 120px;
      text-align: center;
    }

    .position-info {
      flex: 1;
    }

    .position-details {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .detail-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #666;
    }

    .no-active-queues {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-active-queues mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    .recent-history {
      margin-top: 40px;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .history-card {
      background-color: #f9f9f9;
    }

    .history-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .history-info h4 {
      margin: 0 0 4px 0;
      color: #333;
    }

    .history-info p {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 0.875rem;
    }

    .history-date {
      font-size: 0.75rem;
      color: #999;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    /* Status-specific styles */
    .status-waiting {
      background-color: #ff9800;
      color: white;
    }

    .status-called {
      background-color: #4caf50;
      color: white;
    }

    .status-served {
      background-color: #2196f3;
      color: white;
    }

    .status-cancelled {
      background-color: #f44336;
      color: white;
    }

    @media (max-width: 768px) {
      .position-display {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }

      .position-number {
        font-size: 3rem;
      }

      .history-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  activeQueues: QueueEntry[] = [];
  recentHistory: QueueEntry[] = [];
  loading = true;

  constructor() {}

  ngOnInit(): void {
    this.loadCustomerData();
  }

  private loadCustomerData(): void {
    // Mock data for demonstration
    // In a real app, this would fetch data based on the logged-in customer
    setTimeout(() => {
      this.activeQueues = [
        {
          id: 1,
          queueId: 1,
          queueName: 'General Consultation',
          customerId: 1,
          customerName: 'John Doe',
          queueNumber: 15,
          status: QueueEntryStatus.WAITING,
          estimatedWaitTimeMinutes: 25,
          joinedAt: new Date().toISOString(),
          positionInQueue: 3,
          businessName: 'City Medical Clinic'
        }
      ];

      this.recentHistory = [
        {
          id: 2,
          queueId: 2,
          queueName: 'Pharmacy',
          customerId: 1,
          customerName: 'John Doe',
          queueNumber: 8,
          status: QueueEntryStatus.SERVED,
          estimatedWaitTimeMinutes: 15,
          joinedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          servedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
          positionInQueue: 1,
          businessName: 'Downtown Pharmacy'
        }
      ];

      this.loading = false;
    }, 1000);
  }

  cancelEntry(entry: QueueEntry): void {
    // In a real app, this would call the queue service
    console.log('Cancelling entry:', entry);
    this.activeQueues = this.activeQueues.filter(e => e.id !== entry.id);
  }

  getStatusClass(status: QueueEntryStatus): string {
    switch (status) {
      case QueueEntryStatus.WAITING:
        return 'status-waiting';
      case QueueEntryStatus.CALLED:
        return 'status-called';
      case QueueEntryStatus.SERVED:
        return 'status-served';
      case QueueEntryStatus.CANCELLED:
      case QueueEntryStatus.NO_SHOW:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusIcon(status: QueueEntryStatus): string {
    switch (status) {
      case QueueEntryStatus.WAITING:
        return 'schedule';
      case QueueEntryStatus.CALLED:
        return 'notification_important';
      case QueueEntryStatus.SERVED:
        return 'check_circle';
      case QueueEntryStatus.CANCELLED:
        return 'cancel';
      case QueueEntryStatus.NO_SHOW:
        return 'person_off';
      default:
        return 'help';
    }
  }

  getStatusText(status: QueueEntryStatus): string {
    switch (status) {
      case QueueEntryStatus.WAITING:
        return 'Waiting';
      case QueueEntryStatus.CALLED:
        return 'Called';
      case QueueEntryStatus.SERVED:
        return 'Served';
      case QueueEntryStatus.CANCELLED:
        return 'Cancelled';
      case QueueEntryStatus.NO_SHOW:
        return 'No Show';
      default:
        return 'Unknown';
    }
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
