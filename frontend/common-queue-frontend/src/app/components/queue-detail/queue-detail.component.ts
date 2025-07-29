import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QueueStatus } from '../../models/queue.model';
import { QueueEntry, QueueEntryStatus } from '../../models/queue-entry.model';
import { QueueService } from '../../services/queue.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-queue-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <div class="loading-spinner" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading && queueStatus" class="queue-detail">
        <!-- Queue Header -->
        <mat-card class="queue-header">
          <mat-card-header>
            <div mat-card-avatar class="queue-avatar">
              <mat-icon>queue</mat-icon>
            </div>
            <mat-card-title>{{ queueStatus.queueName }}</mat-card-title>
            <mat-card-subtitle>
              <mat-chip [ngClass]="queueStatus.isActive ? 'active-chip' : 'inactive-chip'">
                <mat-icon>{{ queueStatus.isActive ? 'check_circle' : 'cancel' }}</mat-icon>
                {{ queueStatus.isActive ? 'Active' : 'Inactive' }}
              </mat-chip>
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div class="queue-stats-grid">
              <div class="stat-card">
                <div class="stat-number">{{ queueStatus.currentNumber }}</div>
                <div class="stat-label">Now Serving</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ queueStatus.totalWaiting }}</div>
                <div class="stat-label">People Waiting</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ queueStatus.estimatedWaitTime }}min</div>
                <div class="stat-label">Estimated Wait</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ queueStatus.servedToday }}</div>
                <div class="stat-label">Served Today</div>
              </div>
            </div>

            <div class="refresh-info">
              <mat-icon>refresh</mat-icon>
              <span>Updates every 10 seconds</span>
            </div>
          </mat-card-content>

          <mat-card-actions *ngIf="queueStatus.isActive">
            <button mat-raised-button color="primary" (click)="joinQueue()" [disabled]="userInQueue">
              <mat-icon>add</mat-icon>
              {{ userInQueue ? 'Already in Queue' : 'Join Queue' }}
            </button>
            <button mat-button routerLink="/feedback/create"
                    [queryParams]="{queueId: queueStatus.queueId}">
              <mat-icon>feedback</mat-icon>
              Give Feedback
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- User's Queue Entry (if exists) -->
        <mat-card *ngIf="userQueueEntry" class="user-entry-card">
          <mat-card-header>
            <mat-card-title>Your Position</mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <div class="position-display">
              <div class="position-number">{{ userQueueEntry.queueNumber }}</div>
              <div class="position-status">
                <mat-chip [ngClass]="getStatusClass(userQueueEntry.status)">
                  <mat-icon>{{ getStatusIcon(userQueueEntry.status) }}</mat-icon>
                  {{ getStatusText(userQueueEntry.status) }}
                </mat-chip>
              </div>
            </div>

            <div class="entry-details">
              <div class="detail-item">
                <mat-icon>schedule</mat-icon>
                <span>Joined at: {{ formatTime(userQueueEntry.joinedAt) }}</span>
              </div>
              <div class="detail-item" *ngIf="userQueueEntry.estimatedWaitTimeMinutes">
                <mat-icon>timer</mat-icon>
                <span>Estimated wait: {{ userQueueEntry.estimatedWaitTimeMinutes }} minutes</span>
              </div>
              <div class="detail-item">
                <mat-icon>people</mat-icon>
                <span>Position in queue: {{ userQueueEntry.positionInQueue }}</span>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions *ngIf="userQueueEntry.status === 'WAITING'">
            <button mat-button color="warn" (click)="cancelEntry()">
              <mat-icon>cancel</mat-icon>
              Cancel
            </button>
            <button mat-button routerLink="/feedback/{{ userQueueEntry.id }}">
              <mat-icon>feedback</mat-icon>
              Rate Accuracy
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- Queue Information -->
        <mat-card class="queue-info">
          <mat-card-header>
            <mat-card-title>Queue Information</mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <div class="info-grid">
              <div class="info-item">
                <mat-icon>access_time</mat-icon>
                <div>
                  <div class="info-label">Average Service Time</div>
                  <div class="info-value">{{ queueStatus.avgServiceTime }} minutes</div>
                </div>
              </div>
              <div class="info-item" *ngIf="queueStatus.maxCapacity">
                <mat-icon>group</mat-icon>
                <div>
                  <div class="info-label">Maximum Capacity</div>
                  <div class="info-value">{{ queueStatus.maxCapacity }} people</div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="error-message" *ngIf="error">
        <mat-icon>error</mat-icon>
        <h3>Error Loading Queue</h3>
        <p>{{ error }}</p>
        <button mat-button (click)="loadQueueData()">Try Again</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .queue-header {
      margin-bottom: 24px;
    }

    .queue-avatar {
      background-color: #3f51b5;
      color: white;
    }

    .active-chip {
      background-color: #4caf50;
      color: white;
    }

    .inactive-chip {
      background-color: #f44336;
      color: white;
    }

    .queue-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 16px;
      margin: 24px 0;
    }

    .stat-card {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #3f51b5;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
      margin-top: 4px;
    }

    .refresh-info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
      margin-top: 16px;
    }

    .refresh-info mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .user-entry-card {
      margin-bottom: 24px;
      border: 2px solid #3f51b5;
    }

    .position-display {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 24px;
    }

    .position-number {
      font-size: 4rem;
      font-weight: bold;
      color: #3f51b5;
    }

    .position-status mat-chip {
      font-size: 1rem;
      padding: 8px 16px;
    }

    .entry-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .detail-item mat-icon {
      color: #666;
    }

    .queue-info {
      margin-bottom: 24px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background-color: #f9f9f9;
      border-radius: 8px;
    }

    .info-item mat-icon {
      color: #3f51b5;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .info-label {
      font-size: 0.875rem;
      color: #666;
    }

    .info-value {
      font-weight: bold;
      color: #333;
    }

    .error-message {
      text-align: center;
      padding: 60px 20px;
      color: #f44336;
    }

    .error-message mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
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
      .queue-stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .position-display {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class QueueDetailComponent implements OnInit, OnDestroy {
  queueStatus: QueueStatus | null = null;
  userQueueEntry: QueueEntry | null = null;
  loading = true;
  error: string | null = null;
  userInQueue = false;
  private refreshSubscription?: Subscription;
  private queueId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private queueService: QueueService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.queueId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.queueId) {
      this.error = 'Invalid queue ID';
      this.loading = false;
      return;
    }

    this.loadQueueData();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  loadQueueData(): void {
    this.loading = true;
    this.error = null;

    this.queueService.getQueueStatus(this.queueId).subscribe({
      next: (status) => {
        this.queueStatus = status;
        this.loading = false;
        this.checkUserInQueue();
      },
      error: (error) => {
        this.error = 'Failed to load queue information';
        this.loading = false;
        console.error('Error loading queue:', error);
      }
    });
  }

  private startAutoRefresh(): void {
    this.refreshSubscription = interval(10000)
      .pipe(
        switchMap(() => this.queueService.getQueueStatus(this.queueId))
      )
      .subscribe({
        next: (status) => {
          this.queueStatus = status;
          this.checkUserInQueue();
        },
        error: (error) => {
          console.error('Error refreshing queue:', error);
        }
      });
  }

  private checkUserInQueue(): void {
    // In a real app, you'd check if the current user has an active queue entry
    // For now, we'll assume no user is logged in
    this.userInQueue = false;
    this.userQueueEntry = null;
  }

  joinQueue(): void {
    this.router.navigate(['/customer/register'], {
      queryParams: { queueId: this.queueId, returnUrl: `/queue/${this.queueId}` }
    });
  }

  cancelEntry(): void {
    if (!this.userQueueEntry) return;

    this.queueService.cancelQueueEntry(this.userQueueEntry.id).subscribe({
      next: () => {
        this.snackBar.open('Queue entry cancelled', 'Close', { duration: 3000 });
        this.userQueueEntry = null;
        this.userInQueue = false;
        this.loadQueueData();
      },
      error: (error) => {
        this.snackBar.open('Failed to cancel queue entry', 'Close', { duration: 5000 });
        console.error('Error cancelling entry:', error);
      }
    });
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
        return 'Called - Please proceed';
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
}
