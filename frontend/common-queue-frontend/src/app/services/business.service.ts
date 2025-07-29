import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Business } from '../models/business.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  constructor(private apiService: ApiService) {}

  getBusinesses(): Observable<Business[]> {
    return this.apiService.get<Business[]>('/businesses');
  }

  getBusiness(id: number): Observable<Business> {
    return this.apiService.get<Business>(`/businesses/${id}`);
  }

  searchBusinesses(query: string): Observable<Business[]> {
    return this.apiService.get<Business[]>('/businesses/search', { q: query });
  }
}
