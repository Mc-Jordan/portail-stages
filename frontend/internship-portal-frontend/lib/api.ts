import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/auth-store';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest,
  InternshipOfferDTO,
  CreateOfferRequest,
  ApplicationDTO,
  ApplicationRequest,
  UpdateApplicationStatusRequest,
  AgreementDTO,
  ValidateAgreementRequest,
  UserDTO,
  UpdateUserRoleRequest,
  DashboardStatsDTO
} from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && !config.url?.includes('/auth/')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authApi = {
  login: (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/auth/login', data),
  
  register: (data: RegisterRequest): Promise<AxiosResponse<{ message: string }>> =>
    api.post('/auth/register', data),
};

// Offers API calls
export const offersApi = {
  getOffers: (params?: {
    domain?: string;
    duration?: number;
    location?: string;
    search?: string;
  }): Promise<AxiosResponse<InternshipOfferDTO[]>> =>
    api.get('/offers', { params }),
  
  getOffer: (id: number): Promise<AxiosResponse<InternshipOfferDTO>> =>
    api.get(`/offers/${id}`),
  
  createOffer: (data: CreateOfferRequest): Promise<AxiosResponse<InternshipOfferDTO>> =>
    api.post('/offers', data),
  
  updateOffer: (id: number, data: CreateOfferRequest): Promise<AxiosResponse<InternshipOfferDTO>> =>
    api.put(`/offers/${id}`, data),
  
  getCompanyOffers: (): Promise<AxiosResponse<InternshipOfferDTO[]>> =>
    api.get('/offers/company/me'),
};

// Applications API calls
export const applicationsApi = {
  applyToOffer: (offerId: number, formData: FormData): Promise<AxiosResponse<ApplicationDTO>> =>
    api.post(`/applications/apply/${offerId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getStudentApplications: (): Promise<AxiosResponse<ApplicationDTO[]>> =>
    api.get('/applications/student/me'),
  
  getOfferApplications: (offerId: number): Promise<AxiosResponse<ApplicationDTO[]>> =>
    api.get(`/applications/offer/${offerId}`),
  
  updateApplicationStatus: (
    applicationId: number, 
    data: UpdateApplicationStatusRequest
  ): Promise<AxiosResponse<ApplicationDTO>> =>
    api.post(`/applications/${applicationId}/update-status`, data),
};

// Agreements API calls
export const agreementsApi = {
  getPendingAgreements: (): Promise<AxiosResponse<AgreementDTO[]>> =>
    api.get('/agreements/teacher/pending'),
  
  validateAgreement: (
    id: number, 
    data: ValidateAgreementRequest
  ): Promise<AxiosResponse<AgreementDTO>> =>
    api.post(`/agreements/${id}/validate`, data),
  
  downloadAgreement: (id: number): Promise<AxiosResponse<Blob>> =>
    api.get(`/agreements/${id}/download`, { responseType: 'blob' }),
};

// Admin API calls
export const adminApi = {
  getUsers: (): Promise<AxiosResponse<UserDTO[]>> =>
    api.get('/admin/users'),
  
  updateUserRole: (
    userId: number, 
    data: UpdateUserRoleRequest
  ): Promise<AxiosResponse<UserDTO>> =>
    api.put(`/admin/users/${userId}/role`, data),
  
  getDashboardStats: (): Promise<AxiosResponse<DashboardStatsDTO>> =>
    api.get('/admin/stats/dashboard'),
  
  downloadReport: (): Promise<AxiosResponse<Blob>> =>
    api.get('/admin/reports/internships-by-field', { responseType: 'blob' }),
};

export default api;
