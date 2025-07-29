export interface Queue {
  id: number;
  queueName: string;
  description?: string;
  queueType: QueueType;
  avgServiceTimeMinutes: number;
  currentNumber: number;
  nextNumber: number;
  isActive: boolean;
  maxCapacity?: number;
  colorCode?: string;
  createdAt: string;
  updatedAt: string;
}

export enum QueueType {
  GENERAL = 'GENERAL',
  CONSULTATION = 'CONSULTATION',
  PHARMACY = 'PHARMACY',
  CASHIER = 'CASHIER',
  APPOINTMENT = 'APPOINTMENT',
  PRIORITY = 'PRIORITY',
  EXPRESS = 'EXPRESS',
  WALKIN = 'WALKIN'
}

export interface QueueStatus {
  queueId: number;
  queueName: string;
  currentNumber: number;
  nextNumber: number;
  totalWaiting: number;
  estimatedWaitTime: number;
  isActive: boolean;
  maxCapacity?: number;
  avgServiceTime: number;
  servedToday: number;
}

export interface QueueTimingRequest {
  queueName: string;
  description?: string;
  queueType: QueueType;
  avgServiceTimeMinutes: number;
  maxCapacity?: number;
  colorCode?: string;
}

export interface PublicQueueView {
  queueId: number;
  queueName: string;
  currentNumber: number;
  totalWaiting: number;
  estimatedWaitTime: number;
  colorCode: string;
  queueType: string;
}
