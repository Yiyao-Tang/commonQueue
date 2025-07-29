import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicQueueView } from '../../models/queue.model';
import { QueueService } from '../../services/queue.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-public-display',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="display-container">
      <div class="header">
        <h1>Queue Status</h1>
        <div class="timestamp">
          Last updated: {{ lastUpdated | date:'HH:mm:ss' }}
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <mat-spinner diameter="60"></mat-spinner>
      </div>

      <div class="queues-display" *ngIf="!loading && queues.length > 0">
        <div class="queue-card"
             *ngFor="let queue of queues"
             [style.border-left-color]="queue.colorCode">
          <div class="queue-header">
            <h2>{{ queue.queueName }}</h2>
            <span class="queue-type">{{ queue.queueType }}</span>
          </div>

          <div class="queue-content">
            <div class="current-number">
              <div class="label">Now Serving</div>
              <div class="number">{{ queue.currentNumber }}</div>
            </div>

            <div class="queue-stats">
              <div class="stat">
                <mat-icon>people</mat-icon>
                <span class="stat-value">{{ queue.totalWaiting }}</span>
                <span class="stat-label">Waiting</span>
              </div>

              <div class="stat">
                <mat-icon>schedule</mat-icon>
                <span class="stat-value">{{ queue.estimatedWaitTime }}min</span>
                <span class="stat-label">Est. Wait</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="no-queues" *ngIf="!loading && queues.length === 0">
        <mat-icon>info</mat-icon>
        <h2>No Active Queues</h2>
        <p>All queues are currently closed</p>
      </div>

      <div class="footer">
        <div class="powered-by">
          <mat-icon>queue</mat-icon>
          <span>Powered by Common Queue</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .display-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      flex-direction: column;
    }

    .header {
      text-align: center;
      padding: 40px 20px;
      background: rgba(0, 0, 0, 0.1);
    }

    .header h1 {
      font-size: 3rem;
      margin-bottom: 16px;
      font-weight: 300;
    }

    .timestamp {
      font-size: 1.1rem;
      opacity: 0.8;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
    }

    .queues-display {
      flex: 1;
      padding: 40px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 30px;
      align-content: start;
    }

    .queue-card {
      background: rgba(255, 255, 255, 0.95);
      color: #333;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border-left: 8px solid #3f51b5;
      min-height: 280px;
    }

    .queue-header {
      margin-bottom: 30px;
      text-align: center;
    }

    .queue-header h2 {
      font-size: 2rem;
      margin-bottom: 8px;
      color: #333;
    }

    .queue-type {
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .queue-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
    }

    .current-number {
      text-align: center;
    }

    .current-number .label {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 8px;
    }

    .current-number .number {
      font-size: 5rem;
      font-weight: bold;
      color: #3f51b5;
      line-height: 1;
    }

    .queue-stats {
      display: flex;
      gap: 40px;
      width: 100%;
      justify-content: center;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      min-width: 100px;
    }

    .stat mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #666;
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: bold;
      color: #3f51b5;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .no-queues {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      opacity: 0.8;
    }

    .no-queues mat-icon {
      font-size: 120px;
      width: 120px;
      height: 120px;
      margin-bottom: 24px;
    }

    .no-queues h2 {
      font-size: 2.5rem;
      margin-bottom: 16px;
      font-weight: 300;
    }

    .no-queues p {
      font-size: 1.2rem;
    }

    .footer {
      padding: 20px;
      text-align: center;
      background: rgba(0, 0, 0, 0.1);
    }

    .powered-by {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      opacity: 0.7;
      font-size: 0.875rem;
    }

    .powered-by mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    @media (max-width: 768px) {
      .header h1 {
        font-size: 2rem;
      }

      .queues-display {
        grid-template-columns: 1fr;
        padding: 20px;
      }

      .queue-card {
        padding: 20px;
        min-height: 240px;
      }

      .current-number .number {
        font-size: 3.5rem;
      }

      .queue-stats {
        gap: 20px;
      }
    }

    @media (min-width: 1200px) {
      .queues-display {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class PublicDisplayComponent implements OnInit, OnDestroy {
  queues: PublicQueueView[] = [];
  loading = true;
  lastUpdated = new Date();
  private refreshSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private queueService: QueueService
  ) {}

  ngOnInit(): void {
    const businessId = Number(this.route.snapshot.paramMap.get('businessId'));
    if (businessId) {
      this.loadQueues(businessId);
      this.startAutoRefresh(businessId);
    }
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  private loadQueues(businessId: number): void {
    this.queueService.getPublicQueueView(businessId).subscribe({
      next: (queues) => {
        this.queues = queues;
        this.lastUpdated = new Date();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading queues:', error);
        this.loading = false;
      }
    });
  }

  private startAutoRefresh(businessId: number): void {
    this.refreshSubscription = interval(5000) // Refresh every 5 seconds
      .pipe(
        switchMap(() => this.queueService.getPublicQueueView(businessId))
      )
      .subscribe({
        next: (queues) => {
          this.queues = queues;
          this.lastUpdated = new Date();
        },
        error: (error) => {
          console.error('Error refreshing queues:', error);
        }
      });
  }
}
