import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Queue, QueueStatus, QueueTimingRequest, PublicQueueView } from '../models/queue.model';
import { QueueEntry, JoinQueueRequest } from '../models/queue-entry.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  constructor(private apiService: ApiService) {}

  // Business queue management
  createQueue(businessId: number, request: QueueTimingRequest): Observable<Queue> {
    return this.apiService.post<Queue>(`/queues/business/${businessId}`, request);
  }

  updateQueue(queueId: number, request: QueueTimingRequest): Observable<Queue> {
    return this.apiService.put<Queue>(`/queues/${queueId}`, request);
  }

  deleteQueue(queueId: number): Observable<ApiResponse> {
    return this.apiService.delete<ApiResponse>(`/queues/${queueId}`);
  }

  getBusinessQueues(businessId: number): Observable<Queue[]> {
    return this.apiService.get<Queue[]>(`/queues/business/${businessId}`);
  }

  // Public queue operations
  getQueueStatus(queueId: number): Observable<QueueStatus> {
    return this.apiService.get<QueueStatus>(`/queues/${queueId}/status`);
  }

  getPublicQueueView(businessId: number): Observable<PublicQueueView[]> {
    return this.apiService.get<PublicQueueView[]>(`/queues/public/${businessId}`);
  }

  // Customer queue operations
  joinQueue(queueId: number, request: JoinQueueRequest): Observable<QueueEntry> {
    return this.apiService.post<QueueEntry>(`/queues/${queueId}/join`, request);
  }

  getCustomerPosition(queueId: number, customerId: number): Observable<QueueEntry> {
    return this.apiService.get<QueueEntry>(`/queues/${queueId}/position/${customerId}`);
  }

  cancelQueueEntry(entryId: number): Observable<QueueEntry> {
    return this.apiService.put<QueueEntry>(`/queues/entries/${entryId}/cancel`, {});
  }

  // Business staff operations
  callNextCustomer(queueId: number): Observable<QueueEntry> {
    return this.apiService.post<QueueEntry>(`/queues/${queueId}/call-next`, {});
  }

  markAsServed(entryId: number): Observable<QueueEntry> {
    return this.apiService.put<QueueEntry>(`/queues/entries/${entryId}/served`, {});
  }

  markAsNoShow(entryId: number): Observable<QueueEntry> {
    return this.apiService.put<QueueEntry>(`/queues/entries/${entryId}/no-show`, {});
  }

  getQueueEntries(queueId: number): Observable<QueueEntry[]> {
    return this.apiService.get<QueueEntry[]>(`/queues/${queueId}/entries`);
  }

  resetQueue(queueId: number): Observable<ApiResponse> {
    return this.apiService.post<ApiResponse>(`/queues/${queueId}/reset`, {});
  }
}
