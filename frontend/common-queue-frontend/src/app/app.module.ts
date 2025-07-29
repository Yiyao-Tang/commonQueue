// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//
// // Angular Material Modules
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatListModule } from '@angular/material/list';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatBadgeModule } from '@angular/material/badge';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { MatTooltipModule } from '@angular/material/tooltip';
//
// // Components
// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';
//
// // Business Components
// import { BusinessLoginComponent } from './components/business/business-login/business-login.component';
// import { BusinessDashboardComponent } from './components/business/business-dashboard/business-dashboard.component';
// import { QueueManagementComponent } from './components/business/queue-management/queue-management.component';
// import { QueueCreateDialogComponent } from './components/business/queue-create-dialog/queue-create-dialog.component';
// import { QueueEntriesComponent } from './components/business/queue-entries/queue-entries.component';
// import { BusinessStatsComponent } from './components/business/business-stats/business-stats.component';
//
// // Customer Components
// import { CustomerHomeComponent } from './components/customer/customer-home/customer-home.component';
// import { BusinessListComponent } from './components/customer/business-list/business-list.component';
// import { QueueJoinComponent } from './components/customer/queue-join/queue-join.component';
// import { CustomerQueueStatusComponent } from './components/customer/customer-queue-status/customer-queue-status.component';
// import { FeedbackDialogComponent } from './components/customer/feedback-dialog/feedback-dialog.component';
//
// // Shared Components
// import { NavigationComponent } from './components/shared/navigation/navigation.component';
// import { PublicQueueDisplayComponent } from './components/shared/public-queue-display/public-queue-display.component';
// import { LoadingSpinnerComponent } from './components/shared/loading-spinner/loading-spinner.component';
//
// // Services
// import { AuthService } from './services/auth.service';
// import { QueueService } from './services/queue.service';
// import { BusinessService } from './services/business.service';
// import { CustomerService } from './services/customer.service';
// import { FeedbackService } from './services/feedback.service';
// import { NotificationService } from './services/notification.service';
// import { WebSocketService } from './services/websocket.service';
//
// // Guards and Interceptors
// import { AuthGuard } from './guards/auth.guard';
// import { AuthInterceptor } from './interceptors/auth.interceptor';
// import { ErrorInterceptor } from './interceptors/error.interceptor';
//
// @NgModule({
//   declarations: [
//     AppComponent,
//
//     // Business Components
//     BusinessLoginComponent,
//     BusinessDashboardComponent,
//     QueueManagementComponent,
//     QueueCreateDialogComponent,
//     QueueEntriesComponent,
//     BusinessStatsComponent,
//
//     // Customer Components
//     CustomerHomeComponent,
//     BusinessListComponent,
//     QueueJoinComponent,
//     CustomerQueueStatusComponent,
//     FeedbackDialogComponent,
//
//     // Shared Components
//     NavigationComponent,
//     PublicQueueDisplayComponent,
//     LoadingSpinnerComponent
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     BrowserAnimationsModule,
//     HttpClientModule,
//     ReactiveFormsModule,
//     FormsModule,
//
//     // Angular Material
//     MatToolbarModule,
//     MatSidenavModule,
//     MatListModule,
//     MatIconModule,
//     MatButtonModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatTableModule,
//     MatPaginatorModule,
//     MatSortModule,
//     MatDialogModule,
//     MatSnackBarModule,
//     MatProgressSpinnerModule,
//     MatChipsModule,
//     MatBadgeModule,
//     MatTabsModule,
//     MatExpansionModule,
//     MatSlideToggleModule,
//     MatProgressBarModule,
//     MatTooltipModule
//   ],
//   providers: [
//     AuthService,
//     QueueService,
//     BusinessService,
//     CustomerService,
//     FeedbackService,
//     NotificationService,
//     WebSocketService,
//     AuthGuard,
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: AuthInterceptor,
//       multi: true
//     },
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: ErrorInterceptor,
//       multi: true
//     }
//   ],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }
