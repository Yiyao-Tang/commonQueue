import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Customer, CustomerRegistrationRequest } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(private apiService: ApiService) {}

  registerCustomer(request: CustomerRegistrationRequest): Observable<Customer> {
    return this.apiService.post<Customer>('/customers/register', request);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.apiService.get<Customer>(`/customers/${id}`);
  }

  updateCustomer(id: number, data: Partial<Customer>): Observable<Customer> {
    return this.apiService.put<Customer>(`/customers/${id}`, data);
  }
}
