export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationErrors {
  [key: string]: string[];
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  } else if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Name validation
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name.trim()) {
    errors.push('Name is required');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    errors.push('Name can only contain letters and spaces');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Ticket title validation
export const validateTicketTitle = (title: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!title.trim()) {
    errors.push('Title is required');
  } else if (title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  } else if (title.trim().length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Ticket description validation
export const validateTicketDescription = (description: string): ValidationResult => {
  const errors: string[] = [];
  
  if (description && description.length > 1000) {
    errors.push('Description cannot exceed 1000 characters');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Comment validation
export const validateComment = (comment: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!comment.trim()) {
    errors.push('Comment cannot be empty');
  } else if (comment.trim().length < 2) {
    errors.push('Comment must be at least 2 characters long');
  } else if (comment.length > 500) {
    errors.push('Comment cannot exceed 500 characters');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!confirmPassword) {
    errors.push('Please confirm your password');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Comprehensive form validation
export const validateLoginForm = (email: string, password: string): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.errors;
  }
  
  if (!password.trim()) {
    errors.password = ['Password is required'];
  }
  
  return errors;
};

export const validateRegisterForm = (name: string, email: string, password: string, confirmPassword: string): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const nameValidation = validateName(name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.errors;
  }
  
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.errors;
  }
  
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors;
  }
  
  const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.errors;
  }
  
  return errors;
};

export const validateTicketForm = (title: string, description?: string): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  const titleValidation = validateTicketTitle(title);
  if (!titleValidation.isValid) {
    errors.title = titleValidation.errors;
  }
  
  if (description) {
    const descriptionValidation = validateTicketDescription(description);
    if (!descriptionValidation.isValid) {
      errors.description = descriptionValidation.errors;
    }
  }
  
  return errors;
};