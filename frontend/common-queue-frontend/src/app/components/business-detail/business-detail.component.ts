import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Business, BusinessType } from '../../models/business.model';
import { PublicQueueView } from '../../models/queue.model';
import { BusinessService } from '../../services/business.service';
import { QueueService } from '../../services/queue.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-business-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="container">
      <div class="loading-spinner" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading && business" class="business-detail">
        <!-- Business Header -->
        <mat-card class="business-header">
          <mat-card-header>
            <div mat-card-avatar class="business-avatar">
              <mat-icon>business</mat-icon>
            </div>
            <mat-card-title>{{ business.businessName }}</mat-card-title>
            <mat-card-subtitle>{{ getBusinessTypeDisplay(business.businessType) }}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <p *ngIf="business.description">{{ business.description }}</p>

            <div class="business-info">
              <div *ngIf="business.address" class="info-item">
                <mat-icon>location_on</mat-icon>
                <span>{{ business.address }}</span>
              </div>
              <div *ngIf="business.phone" class="info-item">
                <mat-icon>phone</mat-icon>
                <span>{{ business.phone }}</span>
              </div>
              <div class="info-item">
                <mat-icon [ngClass]="business.isOpen ? 'open' : 'closed'">
                  {{ business.isOpen ? 'schedule' : 'schedule_off' }}
                </mat-icon>
                <span [ngClass]="business.isOpen ? 'open' : 'closed'">
                  {{ business.isOpen ? 'Open Now' : 'Closed' }}
                </span>
              </div>
              <div *ngIf="business.openingTime && business.closingTime" class="info-item">
                <mat-icon>access_time</mat-icon>
                <span>{{ business.openingTime }} - {{ business.closingTime }}</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Queue Status -->
        <div class="queues-section">
          <h2>Current Queue Status</h2>

          <div class="refresh-info">
            <mat-icon>refresh</mat-icon>
            <span>Auto-refreshing every 30 seconds</span>
          </div>

          <div class="queues-grid" *ngIf="queues && queues.length > 0">
            <mat-card *ngFor="let queue of queues" class="queue-card">
              <mat-card-header>
                <mat-card-title>{{ queue.queueName }}</mat-card-title>
                <mat-card-subtitle>{{ queue.queueType }}</mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <div class="queue-stats">
                  <div class="stat-item">
                    <div class="stat-number">{{ queue.currentNumber }}</div>
                    <div class="stat-label">Now Serving</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">{{ queue.totalWaiting }}</div>
                    <div class="stat-label">Waiting</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">{{ queue.estimatedWaitTime }}min</div>
                    <div class="stat-label">Est. Wait</div>
                  </div>
                </div>
              </mat-card-content>

              <mat-card-actions>
                <button mat-raised-button color="primary"
                        [disabled]="!business.isOpen"
                        (click)="joinQueue(queue.queueId)">
                  <mat-icon>add</mat-icon>
                  Join Queue
                </button>
                <button mat-button routerLink="/queue/{{ queue.queueId }}">
                  <mat-icon>visibility</mat-icon>
                  View Details
                </button>
              </mat-card-actions>
            </mat-card>
          </div>

          <div class="no-queues" *ngIf="queues && queues.length === 0">
            <mat-icon>queue</mat-icon>
            <h3>No Active Queues</h3>
            <p>This business doesn't have any active queues at the moment.</p>
          </div>
        </div>
      </div>

      <div class="error-message" *ngIf="error">
        <mat-icon>error</mat-icon>
        <h3>Error Loading Business</h3>
        <p>{{ error }}</p>
        <button mat-button (click)="loadBusinessData()">Try Again</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .business-header {
      margin-bottom: 32px;
    }

    .business-avatar {
      background-color: #3f51b5;
      color: white;
    }

    .business-info {
      margin-top: 16px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .info-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #666;
    }

    .open {
      color: #4caf50;
    }

    .closed {
      color: #f44336;
    }

    .queues-section h2 {
      margin-bottom: 16px;
      color: #333;
    }

    .refresh-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      color: #666;
      font-size: 14px;
    }

    .refresh-info mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .queues-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .queue-card {
      height: 100%;
    }

    .queue-stats {
      display: flex;
      justify-content: space-around;
      text-align: center;
      margin: 16px 0;
    }

    .stat-item {
      flex: 1;
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

    @media (max-width: 768px) {
      .queues-grid {
        grid-template-columns: 1fr;
      }

      .queue-stats {
        flex-direction: column;
        gap: 16px;
      }
    }
  `]
})
export class BusinessDetailComponent implements OnInit, OnDestroy {
  business: Business | null = null;
  queues: PublicQueueView[] = [];
  loading = true;
  error: string | null = null;
  private refreshSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private businessService: BusinessService,
    private queueService: QueueService
  ) {}

  ngOnInit(): void {
    this.loadBusinessData();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  public loadBusinessData(): void {
    const businessId = Number(this.route.snapshot.paramMap.get('id'));
    if (!businessId) {
      this.error = 'Invalid business ID';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;

    this.businessService.getBusiness(businessId).subscribe({
      next: (business) => {
        this.business = business;
        this.loadQueues(businessId);
      },
      error: (error) => {
        this.error = 'Failed to load business information';
        this.loading = false;
        console.error('Error loading business:', error);
      }
    });
  }

  private loadQueues(businessId: number): void {
    this.queueService.getPublicQueueView(businessId).subscribe({
      next: (queues) => {
        this.queues = queues;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load queue information';
        this.loading = false;
        console.error('Error loading queues:', error);
      }
    });
  }

  private startAutoRefresh(): void {
    this.refreshSubscription = interval(30000)
      .pipe(
        switchMap(() => {
          const businessId = Number(this.route.snapshot.paramMap.get('id'));
          return this.queueService.getPublicQueueView(businessId);
        })
      )
      .subscribe({
        next: (queues) => {
          this.queues = queues;
        },
        error: (error) => {
          console.error('Error refreshing queues:', error);
        }
      });
  }

  joinQueue(queueId: number): void {
    this.router.navigate(['/customer/register'], {
      queryParams: { queueId, returnUrl: `/queue/${queueId}` }
    });
  }

  getBusinessTypeDisplay(type: BusinessType): string {
    const typeMap: Record<BusinessType, string> = {
      [BusinessType.CLINIC]: 'Clinic',
      [BusinessType.RESTAURANT]: 'Restaurant',
      [BusinessType.RETAIL]: 'Retail Store',
      [BusinessType.SERVICE_CENTER]: 'Service Center',
      [BusinessType.PHARMACY]: 'Pharmacy',
      [BusinessType.BANK]: 'Bank',
      [BusinessType.GOVERNMENT]: 'Government Office',
      [BusinessType.OTHER]: 'Other'
    };
    return typeMap[type] || type;
  }
}
