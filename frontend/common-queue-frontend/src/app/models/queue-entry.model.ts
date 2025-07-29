export interface QueueEntry {
  id: number;
  queueId: number;
  queueName: string;
  customerId: number;
  customerName: string;
  queueNumber: number;
  status: QueueEntryStatus;
  estimatedWaitTimeMinutes: number;
  joinedAt: string;
  calledAt?: string;
  servedAt?: string;
  positionInQueue: number;
  businessName: string;
}

export enum QueueEntryStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  SERVED = 'SERVED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export interface JoinQueueRequest {
  customerId: number;
}
