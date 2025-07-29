import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private apiService: ApiService) {
    this.checkAuthStatus();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    return this.apiService.post<any>('/auth/business/login', { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            //localStorage.setItem('token', response.token);
            localStorage.setItem('business', JSON.stringify(response.business));
            this.isAuthenticatedSubject.next(true);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      this.isAuthenticatedSubject.next(true);
      // Optionally verify token with backend
    }
  }
}
