// import { Injectable } from '@angular/core';
// import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { AuthService } from '../services/auth.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//
//   constructor(
//     private router: Router,
//     private authService: AuthService,
//     private snackBar: MatSnackBar
//   ) {}
//
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     const currentUser = this.authService.currentUserValue;
//
//     if (currentUser && this.authService.isLoggedIn) {
//       // Check if route requires specific role
//       const requiredRole = route.data?.['role'];
//
//       if (requiredRole && !this.authService.hasRole(requiredRole)) {
//         this.snackBar.open('Access denied. Insufficient permissions.', 'Close', {
//           duration: 5000,
//           panelClass: ['error-snackbar']
//         });
//
//         // Redirect to appropriate page based on user role
//         this.router.navigate(['/business/dashboard']);
//         return false;
//       }
//
//       // User is logged in and has required role
//       return true;
//     }
//
//     // User is not logged in
//     this.snackBar.open('Please log in to access this page.', 'Close', {
//       duration: 3000,
//       panelClass: ['warning-snackbar']
//     });
//
//     // Redirect to login page with return url
//     this.router.navigate(['/business/login'], {
//       queryParams: { returnUrl: state.url }
//     });
//
//     return false;
//   }
// }
