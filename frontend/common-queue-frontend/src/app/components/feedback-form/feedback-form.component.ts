import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FeedbackService } from '../../services/feedback.service';
import { FeedbackRequest } from '../../models/feedback.model';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card class="feedback-card">
        <mat-card-header>
          <mat-card-title>Rate Your Experience</mat-card-title>
          <mat-card-subtitle>
            Help us improve our queue management system
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="feedbackForm" (ngSubmit)="onSubmit()">

            <!-- Queue Accuracy Rating -->
            <div class="rating-section">
              <h3>Queue Time Accuracy</h3>
              <p>How accurate was the estimated wait time?</p>
              <div class="star-rating">
                <button type="button"
                        *ngFor="let star of [1,2,3,4,5]"
                        class="star-button"
                        [class.selected]="star <= accuracyRating"
                        (click)="setAccuracyRating(star)">
                  <mat-icon>{{ star <= accuracyRating ? 'star' : 'star_border' }}</mat-icon>
                </button>
              </div>
              <div class="rating-labels">
                <span>Very Inaccurate</span>
                <span>Very Accurate</span>
              </div>
            </div>

            <!-- Service Quality Rating -->
            <div class="rating-section">
              <h3>Service Quality</h3>
              <p>How would you rate the overall service quality?</p>
              <div class="star-rating">
                <button type="button"
                        *ngFor="let star of [1,2,3,4,5]"
                        class="star-button"
                        [class.selected]="star <= serviceRating"
                        (click)="setServiceRating(star)">
                  <mat-icon>{{ star <= serviceRating ? 'star' : 'star_border' }}</mat-icon>
                </button>
              </div>
              <div class="rating-labels">
                <span>Very Poor</span>
                <span>Excellent</span>
              </div>
            </div>

            <!-- Comments -->
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Additional Comments</mat-label>
              <textarea matInput
                        formControlName="comment"
                        rows="4"
                        placeholder="Tell us more about your experience (optional)">
              </textarea>
              <mat-hint>Help us understand how we can improve</mat-hint>
            </mat-form-field>

            <!-- Anonymous Option -->
            <mat-checkbox formControlName="isAnonymous" class="anonymous-checkbox">
              Submit feedback anonymously
            </mat-checkbox>

            <div class="thank-you-message">
              <mat-icon>favorite</mat-icon>
              <p>Thank you for taking the time to provide feedback!</p>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button type="button" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Skip
          </button>
          <button mat-raised-button color="primary"
                  [disabled]="!isFormValid() || loading"
                  (click)="onSubmit()">
            <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
            <mat-icon *ngIf="!loading">send</mat-icon>
            {{ loading ? 'Submitting...' : 'Submit Feedback' }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
    }

    .feedback-card {
      width: 100%;
    }

    .rating-section {
      margin-bottom: 32px;
      text-align: center;
    }

    .rating-section h3 {
      margin-bottom: 8px;
      color: #333;
    }

    .rating-section p {
      margin-bottom: 16px;
      color: #666;
    }

    .star-rating {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .star-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .star-button:hover {
      background-color: #f5f5f5;
      transform: scale(1.1);
    }

    .star-button mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #ddd;
      transition: color 0.2s ease;
    }

    .star-button.selected mat-icon {
      color: #ffd700;
    }

    .star-button:hover mat-icon {
      color: #ffed4e;
    }

    .rating-labels {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .anonymous-checkbox {
      margin-bottom: 24px;
    }

    .thank-you-message {
      display: flex;
      align-items: center;
      gap: 12px;
      background-color: #f0f8ff;
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
    }

    .thank-you-message mat-icon {
      color: #e91e63;
    }

    .thank-you-message p {
      margin: 0;
      color: #333;
    }

    mat-card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    mat-spinner {
      margin-right: 8px;
    }

    @media (max-width: 768px) {
      .star-button mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .star-rating {
        gap: 4px;
      }
    }
  `]
})
export class FeedbackFormComponent implements OnInit {
  feedbackForm: FormGroup;
  loading = false;
  accuracyRating = 0;
  serviceRating = 0;
  queueEntryId?: number;
  businessId?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private feedbackService: FeedbackService,
    private snackBar: MatSnackBar
  ) {
    this.feedbackForm = this.fb.group({
      comment: [''],
      isAnonymous: [false]
    });
  }

  ngOnInit(): void {
    // Get parameters from route
    this.route.params.subscribe(params => {
      this.queueEntryId = params['queueEntryId'] ? Number(params['queueEntryId']) : undefined;
    });

    this.route.queryParams.subscribe(params => {
      this.businessId = params['businessId'] ? Number(params['businessId']) : undefined;
    });
  }

  setAccuracyRating(rating: number): void {
    this.accuracyRating = rating;
  }

  setServiceRating(rating: number): void {
    this.serviceRating = rating;
  }

  isFormValid(): boolean {
    return this.accuracyRating > 0;
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.snackBar.open('Please provide at least an accuracy rating', 'Close', { duration: 3000 });
      return;
    }

    if (!this.businessId && !this.queueEntryId) {
      this.snackBar.open('Missing required information', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    const formValue = this.feedbackForm.value;

    const feedbackRequest: FeedbackRequest = {
      businessId: this.businessId!,
      queueEntryId: this.queueEntryId,
      accuracyRating: this.accuracyRating,
      serviceRating: this.serviceRating > 0 ? this.serviceRating : undefined,
      comment: formValue.comment || undefined,
      isAnonymous: formValue.isAnonymous
    };

    this.feedbackService.submitFeedback(feedbackRequest).subscribe({
      next: (feedback) => {
        this.loading = false;
        this.snackBar.open('Thank you for your feedback!', 'Close', { duration: 3000 });
        this.goBack();
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Failed to submit feedback. Please try again.', 'Close', { duration: 5000 });
        console.error('Feedback submission error:', error);
      }
    });
  }

  goBack(): void {
    if (this.queueEntryId) {
      // Go back to queue detail or customer dashboard
      this.router.navigate(['/customer/dashboard']);
    } else if (this.businessId) {
      this.router.navigate(['/business', this.businessId]);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
