// User and Authentication Types
export type Role = 'STUDENT' | 'COMPANY' | 'TEACHER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: Role;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'COMPANY';
  // Student fields
  fieldOfStudy?: string;
  university?: string;
  expectedGraduationYear?: number;
  // Company fields
  companyName?: string;
  address?: string;
  description?: string;
  website?: string;
}

// Internship Offer Types
export type OfferStatus = 'OPEN' | 'CLOSED';

export interface InternshipOfferDTO {
  id: number;
  title: string;
  description: string;
  requiredSkills: string[];
  domain: string;
  location: string;
  durationInMonths: number;
  startDate: string;
  status: OfferStatus;
  createdDate: string;
  companyName: string;
  companyId: number;
}

export interface CreateOfferRequest {
  title: string;
  description: string;
  requiredSkills: string[];
  domain: string;
  location: string;
  durationInMonths: number;
  startDate: string;
}

// Application Types
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface ApplicationDTO {
  id: number;
  internshipOfferId: number;
  offerTitle: string;
  companyName: string;
  companyId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  cvUrl: string;
  coverLetter: string;
  applicationDate: string;
  status: ApplicationStatus;
  feedback?: string;
  fieldOfStudy: string;
  university: string;
  expectedGraduationYear: number;
}

export interface ApplicationRequest {
  coverLetter: string;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
  feedback?: string;
}

// Agreement Types
export type AgreementStatus = 
  | 'PENDING_TEACHER_VALIDATION' 
  | 'VALIDATED' 
  | 'REJECTED_BY_TEACHER' 
  | 'FINAL_APPROVED';

export interface AgreementDTO {
  id: number;
  applicationId: number;
  studentName: string;
  studentEmail: string;
  companyName: string;
  offerTitle: string;
  pdfUrl?: string;
  generationDate: string;
  status: AgreementStatus;
  teacherComments?: string;
  validatingTeacherId?: number;
  validatingTeacherName?: string;
  fieldOfStudy: string;
  university: string;
  expectedGraduationYear: number;
}

export interface ValidateAgreementRequest {
  decision: 'VALIDATED' | 'REJECTED_BY_TEACHER';
  comments: string;
}

// Admin Types
export interface UserDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  companyName?: string;
  fieldOfStudy?: string;
  university?: string;
}

export interface UpdateUserRoleRequest {
  newRole: Role;
}

export interface DashboardStatsDTO {
  totalUsers: number;
  totalOffers: number;
  totalApplications: number;
  totalAgreements: number;
  internshipsByField: Array<{ field: string; count: number }>;
  applicationsPerMonth: Array<{ month: string; count: number }>;
}

// WebSocket message types
export interface ChatMessage {
  senderId: number;
  senderName: string;
  content: string;
  timestamp: string;
  messageType: 'CHAT' | 'JOIN' | 'LEAVE';
}

export interface NotificationMessage {
  id: string;
  type: 'APPLICATION_STATUS_UPDATE' | 'AGREEMENT_VALIDATION' | 'NEW_APPLICATION' | 'NEW_OFFER';
  title: string;
  message: string;
  link: string;
  timestamp: string;
  read: boolean;
}

// API Response Types
export interface ApiError {
  message: string;
  success: false;
}

export interface ApiSuccess<T = any> {
  data?: T;
  message?: string;
  success: true;
}
