import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Feedback, FeedbackRequest } from '../models/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  constructor(private apiService: ApiService) {}

  submitFeedback(request: FeedbackRequest): Observable<Feedback> {
    return this.apiService.post<Feedback>('/feedback', request);
  }

  getBusinessFeedback(businessId: number): Observable<Feedback[]> {
    return this.apiService.get<Feedback[]>(`/feedback/business/${businessId}`);
  }

  getCustomerFeedback(customerId: number): Observable<Feedback[]> {
    return this.apiService.get<Feedback[]>(`/feedback/customer/${customerId}`);
  }
}
