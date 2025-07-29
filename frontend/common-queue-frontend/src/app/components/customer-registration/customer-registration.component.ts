import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { QueueService } from '../../services/queue.service';
import { CustomerRegistrationRequest, NotificationPreference } from '../../models/customer.model';
import { JoinQueueRequest } from '../../models/queue-entry.model';

@Component({
  selector: 'app-customer-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <mat-card class="registration-card">
        <mat-card-header>
          <mat-card-title>Join Queue</mat-card-title>
          <mat-card-subtitle>
            Please provide your details to join the queue
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <mat-icon matPrefix>person</mat-icon>
              <input matInput formControlName="name" required>
              <mat-error *ngIf="registrationForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Phone Number</mat-label>
              <mat-icon matPrefix>phone</mat-icon>
              <input matInput formControlName="phone" type="tel">
              <mat-hint>Optional - for SMS notifications</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email Address</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput formControlName="email" type="email">
              <mat-hint>Optional - for email notifications</mat-hint>
              <mat-error *ngIf="registrationForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Notification Preference</mat-label>
              <mat-select formControlName="notificationPreference">
                <mat-option value="BOTH">Email & SMS</mat-option>
                <mat-option value="EMAIL">Email Only</mat-option>
                <mat-option value="SMS">SMS Only</mat-option>
                <mat-option value="NONE">No Notifications</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="privacy-notice">
              <mat-icon>info</mat-icon>
              <p>
                Your information will only be used for queue management and notifications.
                We respect your privacy and won't share your data with third parties.
              </p>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button type="button" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Back
          </button>
          <button mat-raised-button color="primary"
                  [disabled]="registrationForm.invalid || loading"
                  (click)="onSubmit()">
            <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
            <mat-icon *ngIf="!loading">add</mat-icon>
            {{ loading ? 'Joining...' : 'Join Queue' }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 500px;
      margin: 40px auto;
      padding: 20px;
    }

    .registration-card {
      width: 100%;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .privacy-notice {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      margin: 16px 0;
    }

    .privacy-notice mat-icon {
      color: #666;
      margin-top: 2px;
    }

    .privacy-notice p {
      margin: 0;
      font-size: 14px;
      color: #666;
      line-height: 1.4;
    }

    mat-card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    mat-spinner {
      margin-right: 8px;
    }
  `]
})
export class CustomerRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  loading = false;
  queueId?: number;
  returnUrl?: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private queueService: QueueService,
    private snackBar: MatSnackBar
  ) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: [''],
      email: ['', [Validators.email]],
      notificationPreference: [NotificationPreference.BOTH]
    });
  }

  ngOnInit(): void {
    // Get queue ID and return URL from query parameters
    this.route.queryParams.subscribe(params => {
      this.queueId = params['queueId'] ? Number(params['queueId']) : undefined;
      this.returnUrl = params['returnUrl'];
    });

    // Validate that we have at least phone or email for notifications
    this.registrationForm.valueChanges.subscribe(() => {
      this.validateNotificationFields();
    });
  }

  private validateNotificationFields(): void {
    const phone = this.registrationForm.get('phone')?.value;
    const email = this.registrationForm.get('email')?.value;
    const notificationPref = this.registrationForm.get('notificationPreference')?.value;

    // If user wants notifications but hasn't provided contact info
    if (notificationPref !== NotificationPreference.NONE && !phone && !email) {
      this.registrationForm.get('phone')?.setErrors({ 'contactRequired': true });
      this.registrationForm.get('email')?.setErrors({ 'contactRequired': true });
    } else {
      // Clear contact required errors
      const phoneControl = this.registrationForm.get('phone');
      const emailControl = this.registrationForm.get('email');

      if (phoneControl?.hasError('contactRequired')) {
        delete phoneControl.errors?.['contactRequired'];
        if (Object.keys(phoneControl.errors || {}).length === 0) {
          phoneControl.setErrors(null);
        }
      }

      if (emailControl?.hasError('contactRequired')) {
        delete emailControl.errors?.['contactRequired'];
        if (Object.keys(emailControl.errors || {}).length === 0) {
          emailControl.setErrors(null);
        }
      }
    }
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formValue = this.registrationForm.value;

    const registrationRequest: CustomerRegistrationRequest = {
      name: formValue.name,
      phone: formValue.phone || undefined,
      email: formValue.email || undefined,
      languagePreference: 'en'
    };

    this.customerService.registerCustomer(registrationRequest).subscribe({
      next: (customer) => {
        this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });

        // If we have a queue ID, join the queue immediately
        if (this.queueId) {
          this.joinQueue(customer.id);
        } else {
          // Otherwise, go to customer dashboard
          this.router.navigate(['/customer/dashboard']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Registration failed. Please try again.', 'Close', { duration: 5000 });
        console.error('Registration error:', error);
      }
    });
  }

  private joinQueue(customerId: number): void {
    if (!this.queueId) {
      this.loading = false;
      return;
    }

    const joinRequest: JoinQueueRequest = { customerId };

    this.queueService.joinQueue(this.queueId, joinRequest).subscribe({
      next: (queueEntry) => {
        this.loading = false;
        this.snackBar.open('Successfully joined the queue!', 'Close', { duration: 3000 });

        // Navigate to queue detail or return URL
        const destination = this.returnUrl || `/queue/${this.queueId}`;
        this.router.navigate([destination]);
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Failed to join queue. Please try again.', 'Close', { duration: 5000 });
        console.error('Join queue error:', error);
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    if (this.queueId) {
      this.router.navigate(['/queue', this.queueId]);
    } else {
      this.router.navigate(['/businesses']);
    }
  }
}
