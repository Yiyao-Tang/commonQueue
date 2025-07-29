export interface Feedback {
  id: number;
  customerName: string;
  businessName: string;
  accuracyRating: number;
  serviceRating?: number;
  comment?: string;
  feedbackType: FeedbackType;
  isAnonymous: boolean;
  createdAt: string;
  overallRating: number;
}

export enum FeedbackType {
  QUEUE_ACCURACY = 'QUEUE_ACCURACY',
  SERVICE_QUALITY = 'SERVICE_QUALITY',
  GENERAL = 'GENERAL',
  COMPLAINT = 'COMPLAINT',
  SUGGESTION = 'SUGGESTION'
}

export interface FeedbackRequest {
  customerId?: number;
  businessId: number;
  queueEntryId?: number;
  accuracyRating: number;
  serviceRating?: number;
  comment?: string;
  isAnonymous?: boolean;
}
