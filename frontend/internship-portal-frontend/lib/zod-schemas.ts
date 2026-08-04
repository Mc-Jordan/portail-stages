import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerStudentSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.literal('STUDENT'),
  fieldOfStudy: z.string().min(2, 'Field of study is required'),
  university: z.string().min(2, 'University is required'),
  expectedGraduationYear: z.number().min(2024).max(2030),
});

export const registerCompanySchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.literal('COMPANY'),
  companyName: z.string().min(2, 'Company name is required'),
  address: z.string().min(5, 'Address is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
});

// Offer schemas
export const createOfferSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  requiredSkills: z.array(z.string()).min(1, 'At least one skill is required'),
  domain: z.string().min(2, 'Domain is required'),
  location: z.string().min(2, 'Location is required'),
  durationInMonths: z.number().min(1).max(24),
  startDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Start date must be in the future',
  }),
});

export const offerFiltersSchema = z.object({
  search: z.string().optional(),
  domain: z.string().optional(),
  location: z.string().optional(),
  duration: z.number().optional(),
});

// Application schemas
export const applicationSchema = z.object({
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED']),
  feedback: z.string().optional(),
});

// Agreement schemas
export const validateAgreementSchema = z.object({
  decision: z.enum(['VALIDATED', 'REJECTED_BY_TEACHER']),
  comments: z.string().min(10, 'Comments must be at least 10 characters'),
});

// Admin schemas
export const updateUserRoleSchema = z.object({
  newRole: z.enum(['STUDENT', 'COMPANY', 'TEACHER', 'ADMIN']),
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterStudentFormData = z.infer<typeof registerStudentSchema>;
export type RegisterCompanyFormData = z.infer<typeof registerCompanySchema>;
export type CreateOfferFormData = z.infer<typeof createOfferSchema>;
export type OfferFiltersFormData = z.infer<typeof offerFiltersSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
export type UpdateApplicationStatusFormData = z.infer<typeof updateApplicationStatusSchema>;
export type ValidateAgreementFormData = z.infer<typeof validateAgreementSchema>;
export type UpdateUserRoleFormData = z.infer<typeof updateUserRoleSchema>;
