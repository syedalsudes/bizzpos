// User and Authentication Types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Submission Types
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface Document {
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Submission {
  id: string;
  user_id: string;
  // Business Details
  dba_name: string;
  business_phone: string;
  website?: string;
  business_address: string;
  shipping_address: string;
  tin_ein: string;
  // Personal Details
  owner_first_name: string;
  owner_last_name: string;
  cellphone: string;
  email: string;
  ssn: string; // encrypted
  // Documents
  driver_license_url?: string;
  business_license_url?: string;
  void_check_url?: string;
  additional_docs_url?: string;
  // Status
  status: SubmissionStatus;
  admin_notes?: string;
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Message Types
export type MessageStatus = 'pending' | 'approved' | 'rejected';

export interface Message {
  id: string;
  user_id: string;
  submission_id: string;
  message: string;
  status: MessageStatus;
  created_at: string;
}

// Form Data Type
export interface ApplicationFormData {
  // Business Details
  dba_name: string;
  business_phone: string;
  website?: string;
  business_address: string;
  shipping_address: string;
  tin_ein: string;
  // Personal Details
  owner_first_name: string;
  owner_last_name: string;
  cellphone: string;
  email: string;
  ssn: string;
  // Documents
  driver_license?: File;
  business_license?: File;
  void_check?: File;
  additional_docs?: File;
  // Agreement
  agree_to_terms: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SubmissionResponse extends ApiResponse<Submission> {}
