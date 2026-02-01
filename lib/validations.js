import { z } from 'zod';

/**
 * User role enum
 */
export const UserRole = {
  BRAND: 'brand',
  CREATOR: 'creator',
};

/**
 * Gig status enum
 */
export const GigStatus = {
  DRAFT: 'draft',
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

/**
 * Content type enum
 */
export const ContentType = {
  REEL: 'reel',
  STORY: 'story',
  POST: 'post',
  VIDEO: 'video',
  PHOTO: 'photo',
};

/**
 * Submission status enum
 */
export const SubmissionStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVISION_REQUESTED: 'revision_requested',
};

/**
 * Transaction type enum
 */
export const TransactionType = {
  ESCROW_DEPOSIT: 'escrow_deposit',
  PAYOUT: 'payout',
  REFUND: 'refund',
  WITHDRAWAL: 'withdrawal',
};

/**
 * Transaction status enum
 */
export const TransactionStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

// ============================================
// Validation Schemas
// ============================================

/**
 * Signup validation schema
 */
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum([UserRole.BRAND, UserRole.CREATOR]),
});

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Brand profile validation schema
 */
export const brandProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  industry: z.string().min(2, 'Industry is required'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

/**
 * Creator profile validation schema
 */
export const creatorProfileSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(500),
  portfolioUrl: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  niches: z.array(z.string()).min(1, 'Select at least one niche'),
  socialHandles: z.object({
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    tiktok: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
});

/**
 * Gig creation validation schema
 */
export const gigSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  contentType: z.enum([
    ContentType.REEL,
    ContentType.STORY,
    ContentType.POST,
    ContentType.VIDEO,
    ContentType.PHOTO,
  ]),
  budget: z.number().min(500, 'Budget must be at least ₹500'),
  deadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Deadline must be in the future',
  }),
  slotsAvailable: z.number().min(1, 'At least 1 slot required').max(50),
  requirements: z.object({
    duration: z.string().optional(),
    format: z.string().optional(),
    guidelines: z.string().optional(),
  }).optional(),
  referenceFiles: z.array(z.string()).optional(),
});

/**
 * Submission validation schema
 */
export const submissionSchema = z.object({
  gigId: z.string().uuid(),
  fileUrl: z.string().url('Invalid file URL'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional(),
  notes: z.string().max(500).optional(),
});

/**
 * Submission review validation schema
 */
export const submissionReviewSchema = z.object({
  status: z.enum([SubmissionStatus.APPROVED, SubmissionStatus.REJECTED, SubmissionStatus.REVISION_REQUESTED]),
  feedback: z.string().max(1000).optional(),
});

/**
 * File upload validation
 */
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
