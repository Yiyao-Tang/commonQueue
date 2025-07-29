export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  notificationPreference: NotificationPreference;
  languagePreference: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export enum NotificationPreference {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  BOTH = 'BOTH',
  NONE = 'NONE'
}

export interface CustomerRegistrationRequest {
  name: string;
  email?: string;
  phone?: string;
  languagePreference?: string;
}
