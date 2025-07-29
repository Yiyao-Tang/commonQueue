import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { Queue } from '../../models/queue.model';
import { QueueEntry, QueueEntryStatus } from '../../models/queue-entry.model';
import { QueueService } from '../../services/queue.service';

@Component({
  selector: 'app-queue-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>Queue Management</h1>
        <p>Manage your queues and serve customers efficiently</p>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div class="management-content" *ngIf="!loading">
        <!-- Queue Selection -->
        <div class="queue-selector">
          <h2>Select Queue</h2>
          <div class="queue-cards">
            <mat-card *ngFor="let queue of queues"
                      class="queue-select-card"
                      [class.selected]="selectedQueue?.id === queue.id"
                      (click)="selectQueue(queue)">
              <mat-card-content>
                <div class="queue-info">
                  <h3>{{ queue.queueName }}</h3>
                  <p>{{ queue.queueType }}</p>
                  <div class="queue-stats">
                    <span>Current: {{ queue.currentNumber }}</span>
                    <span>Waiting: {{ getWaitingCount(queue) }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <!-- Selected Queue Management -->
        <div class="queue-management" *ngIf="selectedQueue">
          <mat-card class="control-panel">
            <mat-card-header>
              <mat-card-title>{{ selectedQueue.queueName }}</mat-card-title>
              <mat-card-subtitle>Queue Controls</mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <div class="current-serving">
                <div class="serving-number">
                  <span class="label">Now Serving</span>
                  <span class="number">{{ selectedQueue.currentNumber }}</span>
                </div>
                <div class="queue-actions">
                  <button mat-raised-button color="primary"
                          (click)="callNextCustomer()"
                          [disabled]="!hasWaitingCustomers()">
                    <mat-icon>campaign</mat-icon>
                    Call Next
                  </button>
                  <button mat-button (click)="resetQueue()">
                    <mat-icon>refresh</mat-icon>
                    Reset Queue
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Customer List -->
          <mat-card class="customer-list">
            <mat-card-header>
              <mat-card-title>Customer Queue</mat-card-title>
              <mat-card-subtitle>
                {{ queueEntries.length }} customers in queue
              </mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <div class="table-container">
                <table mat-table [dataSource]="queueEntries" class="customer-table">
                  <!-- Position Column -->
                  <ng-container matColumnDef="position">
                    <th mat-header-cell *matHeaderCellDef>Position</th>
                    <td mat-cell *matCellDef="let entry">{{ entry.positionInQueue }}</td>
                  </ng-container>

                  <!-- Number Column -->
                  <ng-container matColumnDef="number">
                    <th mat-header-cell *matHeaderCellDef>Number</th>
                    <td mat-cell *matCellDef="let entry">
                      <span class="queue-number">{{ entry.queueNumber }}</span>
                    </td>
                  </ng-container>

                  <!-- Customer Column -->
                  <ng-container matColumnDef="customer">
                    <th mat-header-cell *matHeaderCellDef>Customer</th>
                    <td mat-cell *matCellDef="let entry">{{ entry.customerName }}</td>
                  </ng-container>

                  <!-- Status Column -->
                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef>Status</th>
                    <td mat-cell *matCellDef="let entry">
                      <mat-chip [ngClass]="getStatusClass(entry.status)">
                        {{ getStatusText(entry.status) }}
                      </mat-chip>
                    </td>
                  </ng-container>

                  <!-- Wait Time Column -->
                  <ng-container matColumnDef="waitTime">
                    <th mat-header-cell *matHeaderCellDef>Wait Time</th>
                    <td mat-cell *matCellDef="let entry">
                      {{ getWaitTime(entry) }}
                    </td>
                  </ng-container>

                  <!-- Actions Column -->
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let entry">
                      <div class="action-buttons">
                        <button mat-icon-button
                                *ngIf="entry.status === 'CALLED'"
                                (click)="markAsServed(entry)"
                                matTooltip="Mark as Served">
                          <mat-icon color="primary">check_circle</mat-icon>
                        </button>
                        <button mat-icon-button
                                *ngIf="entry.status === 'CALLED'"
                                (click)="markAsNoShow(entry)"
                                matTooltip="Mark as No Show">
                          <mat-icon color="warn">person_off</mat-icon>
                        </button>
                        <button mat-icon-button
                                *ngIf="entry.status === 'WAITING'"
                                (click)="callSpecificCustomer(entry)"
                                matTooltip="Call This Customer">
                          <mat-icon>campaign</mat-icon>
                        </button>
                      </div>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"
                      [class.highlighted]="row.status === 'CALLED'"></tr>
                </table>
              </div>

              <div class="no-customers" *ngIf="queueEntries.length === 0">
                <mat-icon>people_outline</mat-icon>
                <p>No customers in queue</p>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="no-queue-selected" *ngIf="!selectedQueue && queues.length > 0">
          <mat-icon>touch_app</mat-icon>
          <h3>Select a Queue</h3>
          <p>Choose a queue from above to start managing customers</p>
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

    .header {
      text-align: center;
      margin-bottom: 40px;
    }

    .header h1 {
      margin-bottom: 8px;
      color: #333;
    }

    .header p {
      color: #666;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .queue-selector {
      margin-bottom: 32px;
    }

    .queue-selector h2 {
      margin-bottom: 16px;
      color: #333;
    }

    .queue-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }

    .queue-select-card {
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .queue-select-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .queue-select-card.selected {
      border: 2px solid #3f51b5;
      background-color: #f3f4ff;
    }

    .queue-info h3 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .queue-info p {
      margin: 0 0 12px 0;
      color: #666;
      font-size: 0.875rem;
    }

    .queue-stats {
      display: flex;
      gap: 16px;
      font-size: 0.875rem;
      color: #555;
    }

    .control-panel {
      margin-bottom: 24px;
    }

    .current-serving {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
    }

    .serving-number {
      text-align: center;
    }

    .serving-number .label {
      display: block;
      font-size: 1rem;
      color: #666;
      margin-bottom: 8px;
    }

    .serving-number .number {
      font-size: 3rem;
      font-weight: bold;
      color: #3f51b5;
    }

    .queue-actions {
      display: flex;
      gap: 12px;
    }

    .customer-list {
      margin-bottom: 24px;
    }

    .table-container {
      overflow-x: auto;
    }

    .customer-table {
      width: 100%;
    }

    .customer-table th {
      background-color: #f5f5f5;
      font-weight: 600;
    }

    .customer-table tr.highlighted {
      background-color: #e8f5e8;
    }

    .queue-number {
      font-weight: bold;
      color: #3f51b5;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

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

    .no-customers {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-customers mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .no-queue-selected {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-queue-selected mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .current-serving {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }

      .queue-actions {
        justify-content: center;
      }

      .serving-number .number {
        font-size: 2.5rem;
      }
    }
  `]
})
export class QueueManagementComponent implements OnInit {
  queues: Queue[] = [];
  selectedQueue: Queue | null = null;
  queueEntries: QueueEntry[] = [];
  loading = true;
  displayedColumns: string[] = ['position', 'number', 'customer', 'status', 'waitTime', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private queueService: QueueService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const businessId = Number(this.route.snapshot.paramMap.get('businessId'));
    if (businessId) {
      this.loadQueues(businessId);
    }
  }

  private loadQueues(businessId: number): void {
    this.queueService.getBusinessQueues(businessId).subscribe({
      next: (queues) => {
        this.queues = queues.filter(q => q.isActive);
        this.loading = false;
        if (this.queues.length > 0) {
          this.selectQueue(this.queues[0]);
        }
      },
      error: (error) => {
        console.error('Error loading queues:', error);
        this.loading = false;
      }
    });
  }

  selectQueue(queue: Queue): void {
    this.selectedQueue = queue;
    this.loadQueueEntries(queue.id);
  }

  private loadQueueEntries(queueId: number): void {
    this.queueService.getQueueEntries(queueId).subscribe({
      next: (entries) => {
        this.queueEntries = entries.sort((a, b) => a.queueNumber - b.queueNumber);
      },
      error: (error) => {
        console.error('Error loading queue entries:', error);
      }
    });
  }

  callNextCustomer(): void {
    if (!this.selectedQueue) return;

    this.queueService.callNextCustomer(this.selectedQueue.id).subscribe({
      next: (entry) => {
        this.snackBar.open(`Called customer ${entry.customerName} (Number ${entry.queueNumber})`, 'Close', { duration: 3000 });
        this.selectedQueue!.currentNumber = entry.queueNumber;
        this.loadQueueEntries(this.selectedQueue!.id);
      },
      error: (error) => {
        this.snackBar.open('Failed to call next customer', 'Close', { duration: 3000 });
        console.error('Error calling next customer:', error);
      }
    });
  }

  callSpecificCustomer(entry: QueueEntry): void {
    // In a real implementation, you might have a specific endpoint for this
    this.snackBar.open(`Called ${entry.customerName}`, 'Close', { duration: 3000 });
  }

  markAsServed(entry: QueueEntry): void {
    this.queueService.markAsServed(entry.id).subscribe({
      next: () => {
        this.snackBar.open(`${entry.customerName} marked as served`, 'Close', { duration: 3000 });
        this.loadQueueEntries(this.selectedQueue!.id);
      },
      error: (error) => {
        this.snackBar.open('Failed to mark as served', 'Close', { duration: 3000 });
        console.error('Error marking as served:', error);
      }
    });
  }

  markAsNoShow(entry: QueueEntry): void {
    this.queueService.markAsNoShow(entry.id).subscribe({
      next: () => {
        this.snackBar.open(`${entry.customerName} marked as no show`, 'Close', { duration: 3000 });
        this.loadQueueEntries(this.selectedQueue!.id);
      },
      error: (error) => {
        this.snackBar.open('Failed to mark as no show', 'Close', { duration: 3000 });
        console.error('Error marking as no show:', error);
      }
    });
  }

  resetQueue(): void {
    if (!this.selectedQueue) return;

    this.queueService.resetQueue(this.selectedQueue.id).subscribe({
      next: () => {
        this.snackBar.open('Queue reset successfully', 'Close', { duration: 3000 });
        this.selectedQueue!.currentNumber = 0;
        this.selectedQueue!.nextNumber = 1;
        this.loadQueueEntries(this.selectedQueue!.id);
      },
      error: (error) => {
        this.snackBar.open('Failed to reset queue', 'Close', { duration: 3000 });
        console.error('Error resetting queue:', error);
      }
    });
  }

  hasWaitingCustomers(): boolean {
    return this.queueEntries.some(entry => entry.status === QueueEntryStatus.WAITING);
  }

  getWaitingCount(queue: Queue): number {
    return Math.max(0, queue.nextNumber - queue.currentNumber - 1);
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

  getWaitTime(entry: QueueEntry): string {
    const joinedTime = new Date(entry.joinedAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - joinedTime.getTime()) / (1000 * 60));
    return `${diffMinutes}min`;
  }
}
