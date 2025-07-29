import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Business, BusinessType } from '../../models/business.model';
import { BusinessService } from '../../services/business.service';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <div class="search-section">
        <h1>Find Businesses</h1>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search businesses</mat-label>
          <mat-icon matPrefix>search</mat-icon>
          <input matInput [formControl]="searchControl" placeholder="Enter business name or type">
        </mat-form-field>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>

      <div class="businesses-grid" *ngIf="!loading">
        <mat-card *ngFor="let business of businesses" class="business-card">
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
                  {{ business.isOpen ? 'Open' : 'Closed' }}
                </span>
              </div>
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button mat-button routerLink="/business/{{ business.id }}">
              <mat-icon>visibility</mat-icon>
              View Queues
            </button>
            <button mat-raised-button color="primary"
                    routerLink="/business/{{ business.id }}"
                    [disabled]="!business.isOpen">
              <mat-icon>add</mat-icon>
              Join Queue
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="no-results" *ngIf="!loading && businesses.length === 0">
        <mat-icon>search_off</mat-icon>
        <h3>No businesses found</h3>
        <p>Try adjusting your search criteria</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .search-section {
      text-align: center;
      margin-bottom: 40px;
    }

    .search-section h1 {
      margin-bottom: 24px;
      color: #333;
    }

    .search-field {
      width: 100%;
      max-width: 400px;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .businesses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .business-card {
      height: 100%;
      display: flex;
      flex-direction: column;
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

    .info-item.open mat-icon,
    .info-item .open {
      color: #4caf50;
    }

    .info-item.closed mat-icon,
    .info-item .closed {
      color: #f44336;
    }

    mat-card-actions {
      margin-top: auto;
      display: flex;
      gap: 8px;
    }

    .no-results {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-results mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .businesses-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BusinessListComponent implements OnInit {
  businesses: Business[] = [];
  loading = false;
  searchControl = new FormControl('');

  constructor(private businessService: BusinessService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          this.loading = true;
          return query ?
            this.businessService.searchBusinesses(query) :
            this.businessService.getBusinesses();
        })
      )
      .subscribe({
        next: (businesses) => {
          this.businesses = businesses;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading businesses:', error);
          this.loading = false;
        }
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
