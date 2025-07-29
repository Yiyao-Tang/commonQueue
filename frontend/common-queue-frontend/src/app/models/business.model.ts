export interface Business {
  id: number;
  businessName: string;
  email: string;
  phone?: string;
  address?: string;
  description?: string;
  logoUrl?: string;
  themeColor?: string;
  openingTime?: string;
  closingTime?: string;
  isActive: boolean;
  isVerified: boolean;
  businessType: BusinessType;
  createdAt: string;
  isOpen: boolean;
}

export enum BusinessType {
  CLINIC = 'CLINIC',
  RESTAURANT = 'RESTAURANT',
  RETAIL = 'RETAIL',
  SERVICE_CENTER = 'SERVICE_CENTER',
  PHARMACY = 'PHARMACY',
  BANK = 'BANK',
  GOVERNMENT = 'GOVERNMENT',
  OTHER = 'OTHER'
}

export interface BusinessRegistrationRequest {
  businessName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  description?: string;
  businessType: BusinessType;
  openingTime?: string;
  closingTime?: string;
}
