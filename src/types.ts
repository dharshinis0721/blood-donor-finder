export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type AvailabilityStatus = 'Available' | 'Temporarily Unavailable' | 'Unverified';

export type DocumentVerificationStatus = 'Pending Review' | 'Verified' | 'Rejected' | 'Expired';

export interface MedicalCertificate {
  documentId: string;
  fileName: string;
  fileType: string;
  fileData?: string; // base64 or preview
  uploadDate: string;
  verificationStatus: DocumentVerificationStatus;
  reviewedBy?: string;
  reviewNotes?: string;
  reviewedAt?: string;
  expiryDate?: string;
}

export interface DonorConsent {
  shareContactOnEmergency: boolean;
  shareAge: boolean;
  showDistance: boolean;
}

export interface Donor {
  donorId: string;
  fullName: string;
  mobileNumber: string;
  age: number;
  email: string;
  bloodGroup: BloodGroup;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  latitude: number;
  longitude: number;
  lastDonationDate?: string;
  availabilityStatus: AvailabilityStatus;
  medicalCertificate: MedicalCertificate;
  consent: DonorConsent;
  donationCount: number;
  createdAt: string;
  updatedAt: string;
  distanceKm?: number;
  isStraightLine?: boolean;
}

export type UrgencyLevel = 'Critical (Immediate)' | 'Urgent (Within 6 hrs)' | 'High (Within 24 hrs)' | 'Standard';

export interface BloodRequest {
  requestId: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  city: string;
  locationAddress: string;
  latitude: number;
  longitude: number;
  contactPerson: string;
  contactPhone: string;
  requiredDate: string;
  urgency: UrgencyLevel;
  status: 'Active' | 'Fulfilled' | 'Closed';
  notes: string;
  createdAt: string;
}

export interface UserSession {
  role: 'donor' | 'admin';
  email: string;
  name: string;
  donorId?: string;
  token?: string;
}

export interface SearchFilters {
  bloodGroup: string; // 'ALL' or specific BloodGroup
  includeCompatible: boolean;
  cityOrPin: string;
  maxDistanceKm: number; // 0 means any
  minAge: number;
  availabilityOnly: boolean;
  verifiedOnly: boolean;
}
