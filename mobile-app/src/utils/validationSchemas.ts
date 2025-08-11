import * as yup from 'yup';

// Login validation schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(1, 'Password is required'),
});

// Register validation schema
export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters long')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .matches(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .matches(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .matches(/(?=.*\d)/, 'Password must contain at least one number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

// Create/Edit Ticket validation schema
export const ticketSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title cannot exceed 100 characters'),
  description: yup
    .string()
    .max(1000, 'Description cannot exceed 1000 characters'),
  status: yup
    .string()
    .oneOf(['Open', 'In Progress', 'Closed'], 'Please select a valid status')
    .required('Status is required'),
  priority: yup
    .string()
    .oneOf(['Low', 'Medium', 'High', 'Critical'], 'Please select a valid priority')
    .required('Priority is required'),
});

// Comment validation schema
export const commentSchema = yup.object({
  content: yup
    .string()
    .required('Comment cannot be empty')
    .min(2, 'Comment must be at least 2 characters long')
    .max(500, 'Comment cannot exceed 500 characters'),
});

// Export types for TypeScript
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type TicketFormData = yup.InferType<typeof ticketSchema>;
export type CommentFormData = yup.InferType<typeof commentSchema>;