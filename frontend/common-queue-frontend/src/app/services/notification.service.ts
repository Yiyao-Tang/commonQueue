// import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { BehaviorSubject, Observable } from 'rxjs';
//
// export interface AppNotification {
//   id: string;
//   type: 'info' | 'success' | 'warning' | 'error';
//   title: string;
//   message: string;
//   timestamp: Date;
//   read: boolean;
//   actionLabel?: string;
//   actionCallback?: () => void;
//   persistent?: boolean;
// }
//
// @Injectable({
//   providedIn: 'root'
// })
// export class NotificationService {
//   private notifications = new BehaviorSubject<AppNotification[]>([]);
//   private notificationId = 0;
//
//   constructor(private snackBar: MatSnackBar) {
//     // Request browser notification permission
//     this.requestNotificationPermission();
//   }
//
//   /**
//    * Get all notifications
//    */
//   getNotifications(): Observable<AppNotification[]> {
//     return this.notifications.asObservable();
//   }
//
//   /**
//    * Get unread notification count
//    */
//   getUnreadCount(): Observable<number> {
//     return new Observable(observer => {
//       this.notifications.subscribe(notifications => {
//         const unreadCount = notifications.filter(n => !n.read).length;
//         observer.next(unreadCount);
//       });
//     });
//   }
//
//   /**
//    * Show success notification
//    */
//   showSuccess(title: string, message: string, persistent = false): void {
//     this.addNotification({
//       type: 'success',
//       title,
//       message,
//       persistent
//     });
//
//     this.showSnackBar(`${title}: ${message}`, 'success');
//   }
//
//   /**
//    * Show error notification
//    */
//   showError(title: string, message: string, persistent = true): void {
//     this.addNotification({
//       type: 'error',
//       title,
//       message,
//       persistent
//     });
//
//     this.showSnackBar(`${title}: ${message}`, 'error');
//   }
//
//   /**
//    * Show warning notification
//    */
//   showWarning(title: string, message: string, persistent = false): void {
//     this.addNotification({
//       type: 'warning',
//       title,
//       message,
//       persistent
//     });
//
//     this.showSnackBar(`${title}: ${message}`, 'warning');
//   }
//
//   /**
//    * Show info notification
//    */
//   showInfo(title: string, message: string, persistent = false): void {
//     this.addNotification({
//       type: 'info',
//       title,
//       message,
//       persistent
//     });
//
//     this.showSnackBar(`${title}: ${message}`, 'info');
//   }
//
//   /**
//    * Show notification with action
//    */
//   showWithAction(
//     type: 'info' | 'success' | 'warning' | 'error',
//     title: string,
//     message: string,
//     actionLabel: string,
//     actionCallback: () => void,
//     persistent = false
//   ): void {
//     this.addNotification({
//       type,
//       title,
//       message,
//       actionLabel,
//       actionCallback,
//       persistent
//     });
//
//     const snackBarRef = this.snackBar.open(`${title}: ${message}`, actionLabel, {
//       duration: persistent ? 0 : this.getDuration(type),
//       panelClass: [`${type}-snackbar`]
//     });
//
//     snackBarRef.onAction().subscribe(() => {
//       actionCallback();
//     });
//   }
//
//   /**
//    * Show browser notification
//    */
//   showBrowserNotification(title: string, message: string, icon?: string): void {
//     if ('Notification' in window && Notification.permission === 'granted') {
//       const notification = new Notification(title, {
//         body: message,
//         icon: icon || '/assets/icons/icon-192x192.png',
//         badge: '/assets/icons/icon-72x72.png',
//         tag: 'queue-notification',
//         requireInteraction: false
//       });
//
//       // Auto-close after 10 seconds
//       setTimeout(() => {
//         notification.close();
//       }, 10000);
//
//       // Handle notification click
//       notification.onclick = () => {
//         window.focus();
//         notification.close();
//       };
//     }
//   }
//
//   /**
//    * Show queue-specific notifications
//    */
//   showQueueNotification(type: 'called' | 'approaching' | 'served', data: any): void {
//     switch (type) {
//       case 'called':
//         this.showBrowserNotification(
//           'Your Turn!',
//           `You've been called at ${data.businessName}. Please proceed to the service counter.`
//         );
//         this.showSuccess(
//           'Your Turn!',
//           `Queue ${data.queueName} at ${data.businessName}`,
//           true
//         );
//         break;
//
//       case 'approaching':
//         this.showBrowserNotification(
//           'Your Turn is Approaching',
//           `You are next in line at ${data.businessName}. Please be ready.`
//         );
//         this.showWarning(
//           'Your Turn is Approaching',
//           `Queue ${data.queueName} at ${data.businessName}`,
//           false
//         );
//         break;
//
//       case 'served':
//         this.showSuccess(
//           'Service Completed',
//           `Thank you for visiting ${data.businessName}`,
//           false
//         );
//         break;
//     }
//   }
//
//   /**
//    * Mark notification as read
//    */
//   markAsRead(notificationId: string): void {
//     const currentNotifications = this.notifications.value;
//     const updatedNotifications = currentNotifications.map(notification =>
//       notification.id === notificationId
//         ? { ...notification, read: true }
//         : notification
//     );
//     this.notifications.next(updatedNotifications);
//   }
//
//   /**
//    * Mark all notifications as read
//    */
//   markAllAsRead(): void {
//     const currentNotifications = this.notifications.value;
//     const updatedNotifications = currentNotifications.map(notification => ({
//       ...notification,
//       read: true
//     }));
//     this.notifications.next(updatedNotifications);
//   }
//
//   /**
//    * Remove notification
//    */
//   removeNotification(notificationId: string): void {
//     const currentNotifications = this.notifications.value;
//     const updatedNotifications = currentNotifications.filter(
//       notification => notification.id !== notificationId
//     );
//     this.notifications.next(updatedNotifications);
//   }
//
//   /**
//    * Clear all notifications
//    */
//   clearAll(): void {
//     this.notifications.next([]);
//   }
//
//   /**
//    * Clear non-persistent notifications
//    */
//   clearNonPersistent(): void {
//     const currentNotifications = this.notifications.value;
//     const persistentNotifications = currentNotifications.filter(
//       notification => notification.persistent
//     );
//     this.notifications.next(persistentNotifications);
//   }
//
//   /**
//    * Add notification to the list
//    */
//   private addNotification(notification: Partial<AppNotification>): void {
//     const fullNotification: AppNotification = {
//       id: this.generateId(),
//       type: notification.type || 'info',
//       title: notification.title || '',
//       message: notification.message || '',
//       timestamp: new Date(),
//       read: false,
//       persistent: notification.persistent || false,
//       actionLabel: notification.actionLabel,
//       actionCallback: notification.actionCallback
//     };
//
//     const currentNotifications = this.notifications.value;
//     this.notifications.next([fullNotification, ...currentNotifications]);
//
//     // Auto-remove non-persistent notifications after delay
//     if (!fullNotification.persistent) {
//       setTimeout(() => {
//         this.removeNotification(fullNotification.id);
//       }, 300000); // 5 minutes
//     }
//   }
//
//   /**
//    * Show snackbar notification
//    */
//   private showSnackBar(message: string, type: string): void {
//     this.snackBar.open(message, 'Close', {
//       duration: this.getDuration(type as any),
//       panelClass: [`${type}-snackbar`],
//       horizontalPosition: 'center',
//       verticalPosition: 'top'
//     });
//   }
//
//   /**
//    * Get notification duration based on type
//    */
//   private getDuration(type: string): number {
//     switch (type) {
//       case 'error':
//         return 8000;
//       case 'warning':
//         return 6000;
//       case 'success':
//         return 4000;
//       case 'info':
//       default:
//         return 5000;
//     }
//   }
//
//   /**
//    * Generate unique notification ID
//    */
//   private generateId(): string {
//     return `notification_${++this.notificationId}_${Date.now()}`;
//   }
//
//   /**
//    * Request browser notification permission
//    */
//   private requestNotificationPermission(): void {
//     if ('Notification' in window && Notification.permission === 'default') {
//       Notification.requestPermission().then(permission => {
//         if (permission === 'granted') {
//           console.log('Notification permission granted');
//         } else {
//           console.log('Notification permission denied');
//         }
//       });
//     }
//   }
//
//   /**
//    * Check if browser notifications are supported and enabled
//    */
//   isBrowserNotificationEnabled(): boolean {
//     return 'Notification' in window && Notification.permission === 'granted';
//   }
//
//   /**
//    * Test notification (for settings/demo purposes)
//    */
//   testNotification(): void {
//     this.showSuccess(
//       'Test Notification',
//       'This is a test notification to verify the system is working correctly.',
//       false
//     );
//
//     if (this.isBrowserNotificationEnabled()) {
//       this.showBrowserNotification(
//         'Test Browser Notification',
//         'Browser notifications are working correctly!'
//       );
//     }
//   }
// }
