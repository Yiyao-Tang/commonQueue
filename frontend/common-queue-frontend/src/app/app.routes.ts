import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'businesses',
    loadComponent: () => import('./components/business-list/business-list.component').then(m => m.BusinessListComponent)
  },
  {
    path: 'business/:id',
    loadComponent: () => import('./components/business-detail/business-detail.component').then(m => m.BusinessDetailComponent)
  },
  {
    path: 'queue/:id',
    loadComponent: () => import('./components/queue-detail/queue-detail.component').then(m => m.QueueDetailComponent)
  },
  {
    path: 'customer/register',
    loadComponent: () => import('./components/customer-registration/customer-registration.component').then(m => m.CustomerRegistrationComponent)
  },
  {
    path: 'customer/dashboard',
    loadComponent: () => import('./components/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent)
  },
  {
    path: 'feedback/:queueEntryId',
    loadComponent: () => import('./components/feedback-form/feedback-form.component').then(m => m.FeedbackFormComponent)
  },
  {
    path: 'business-login',
    loadComponent: () => import('./components/business-login/business-login.component').then(m => m.BusinessLoginComponent)
  },
  {
    path: 'business-dashboard',
    loadComponent: () => import('./components/business-dashboard/business-dashboard.component').then(m => m.BusinessDashboardComponent)
  },
  {
    path: 'queue-management/:businessId',
    loadComponent: () => import('./components/queue-management/queue-management.component').then(m => m.QueueManagementComponent)
  },
  {
    path: 'public-display/:businessId',
    loadComponent: () => import('./components/public-display/public-display.component').then(m => m.PublicDisplayComponent)
  },
  { path: '**', redirectTo: '/home' }
];
