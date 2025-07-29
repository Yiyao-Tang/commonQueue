// import { Injectable } from '@angular/core';
// import { Observable, Subject, BehaviorSubject } from 'rxjs';
// import { environment } from '../../environments/environment';
// import { AuthService } from './auth.service';
//
// export interface QueueUpdateMessage {
//   type: 'QUEUE_UPDATE' | 'CUSTOMER_CALLED' | 'CUSTOMER_SERVED' | 'POSITION_UPDATE';
//   queueId: number;
//   businessId?: number;
//   customerId?: number;
//   queueNumber?: number;
//   position?: number;
//   estimatedWaitTime?: number;
//   timestamp: string;
//   data?: any;
// }
//
// @Injectable({
//   providedIn: 'root'
// })
// export class WebSocketService {
//   private socket: WebSocket | null = null;
//   private reconnectAttempts = 0;
//   private maxReconnectAttempts = 5;
//   private reconnectInterval = 5000; // 5 seconds
//
//   // Subjects for different types of updates
//   private queueUpdatesSubject = new Subject<QueueUpdateMessage>();
//   private connectionStatusSubject = new BehaviorSubject<boolean>(false);
//   private errorSubject = new Subject<string>();
//
//   constructor(private authService: AuthService) {}
//
//   /**
//    * Connect to WebSocket server
//    */
//   connect(): void {
//     if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//       return; // Already connected
//     }
//
//     try {
//       const wsUrl = environment.wsUrl;
//       const authToken = this.authService.authToken;
//
//       // Include auth token in WebSocket URL as query parameter
//       const socketUrl = authToken ? `${wsUrl}?token=${authToken}` : wsUrl;
//
//       this.socket = new WebSocket(socketUrl);
//
//       this.socket.onopen = (event) => {
//         console.log('WebSocket connected:', event);
//         this.connectionStatusSubject.next(true);
//         this.reconnectAttempts = 0;
//
//         // Send authentication message if needed
//         if (authToken) {
//           this.sendMessage({
//             type: 'AUTH',
//             token: authToken
//           });
//         }
//       };
//
//       this.socket.onmessage = (event) => {
//         try {
//           const message = JSON.parse(event.data);
//           this.handleMessage(message);
//         } catch (error) {
//           console.error('Error parsing WebSocket message:', error);
//         }
//       };
//
//       this.socket.onclose = (event) => {
//         console.log('WebSocket disconnected:', event);
//         this.connectionStatusSubject.next(false);
//         this.socket = null;
//
//         // Attempt to reconnect if not a manual close
//         if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
//           this.scheduleReconnect();
//         }
//       };
//
//       this.socket.onerror = (error) => {
//         console.error('WebSocket error:', error);
//         this.errorSubject.next('WebSocket connection error');
//       };
//
//     } catch (error) {
//       console.error('Failed to create WebSocket connection:', error);
//       this.errorSubject.next('Failed to establish WebSocket connection');
//     }
//   }
//
//   /**
//    * Disconnect from WebSocket server
//    */
//   disconnect(): void {
//     if (this.socket) {
//       this.socket.close(1000, 'Manual disconnect');
//       this.socket = null;
//       this.connectionStatusSubject.next(false);
//     }
//   }
//
//   /**
//    * Send message to WebSocket server
//    */
//   private sendMessage(message: any): void {
//     if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//       this.socket.send(JSON.stringify(message));
//     } else {
//       console.warn('WebSocket is not connected. Cannot send message:', message);
//     }
//   }
//
//   /**
//    * Handle incoming WebSocket messages
//    */
//   private handleMessage(message: any): void {
//     switch (message.type) {
//       case 'QUEUE_UPDATE':
//       case 'CUSTOMER_CALLED':
//       case 'CUSTOMER_SERVED':
//       case 'POSITION_UPDATE':
//         this.queueUpdatesSubject.next(message as QueueUpdateMessage);
//         break;
//
//       case 'AUTH_SUCCESS':
//         console.log('WebSocket authentication successful');
//         break;
//
//       case 'AUTH_FAILED':
//         console.error('WebSocket authentication failed');
//         this.errorSubject.next('WebSocket authentication failed');
//         break;
//
//       case 'ERROR':
//         console.error('WebSocket server error:', message.error);
//         this.errorSubject.next(message.error || 'Server error');
//         break;
//
//       default:
//         console.log('Unknown WebSocket message type:', message);
//     }
//   }
//
//   /**
//    * Schedule reconnection attempt
//    */
//   private scheduleReconnect(): void {
//     this.reconnectAttempts++;
//     console.log(`Scheduling WebSocket reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
//
//     setTimeout(() => {
//       if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
//         this.connect();
//       }
//     }, this.reconnectInterval * this.reconnectAttempts);
//   }
//
//   /**
//    * Subscribe to queue updates
//    */
//   onQueueUpdate(): Observable<QueueUpdateMessage> {
//     return this.queueUpdatesSubject.asObservable();
//   }
//
//   /**
//    * Subscribe to connection status changes
//    */
//   onConnectionStatus(): Observable<boolean> {
//     return this.connectionStatusSubject.asObservable();
//   }
//
//   /**
//    * Subscribe to errors
//    */
//   onError(): Observable<string> {
//     return this.errorSubject.asObservable();
//   }
//
//   /**
//    * Get current connection status
//    */
//   get isConnected(): boolean {
//     return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
//   }
//
//   /**
//    * Subscribe to specific queue updates
//    */
//   subscribeToQueue(queueId: number): void {
//     this.sendMessage({
//       type: 'SUBSCRIBE_QUEUE',
//       queueId: queueId
//     });
//   }
//
//   /**
//    * Unsubscribe from specific queue updates
//    */
//   unsubscribeFromQueue(queueId: number): void {
//     this.sendMessage({
//       type: 'UNSUBSCRIBE_QUEUE',
//       queueId: queueId
//     });
//   }
//
//   /**
//    * Subscribe to business updates (all queues for a business)
//    */
//   subscribeToBusiness(businessId: number): void {
//     this.sendMessage({
//       type: 'SUBSCRIBE_BUSINESS',
//       businessId: businessId
//     });
//   }
//
//   /**
//    * Unsubscribe from business updates
//    */
//   unsubscribeFromBusiness(businessId: number): void {
//     this.sendMessage({
//       type: 'UNSUBSCRIBE_BUSINESS',
//       businessId: businessId
//     });
//   }
//
//   /**
//    * Subscribe to customer updates
//    */
//   subscribeToCustomer(customerId: number): void {
//     this.sendMessage({
//       type: 'SUBSCRIBE_CUSTOMER',
//       customerId: customerId
//     });
//   }
//
//   /**
//    * Unsubscribe from customer updates
//    */
//   unsubscribeFromCustomer(customerId: number): void {
//     this.sendMessage({
//       type: 'UNSUBSCRIBE_CUSTOMER',
//       customerId: customerId
//     });
//   }
//
//   /**
//    * Send ping to keep connection alive
//    */
//   ping(): void {
//     this.sendMessage({
//       type: 'PING',
//       timestamp: new Date().toISOString()
//     });
//   }
//
//   /**
//    * Start periodic ping to keep connection alive
//    */
//   startKeepAlive(): void {
//     setInterval(() => {
//       if (this.isConnected) {
//         this.ping();
//       }
//     }, 30000); // Ping every 30 seconds
//   }
// }
