/**
 * Error handling middleware for the application
 * Provides retry logic, error classification, and user-friendly messages
 */

export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500, details = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const ErrorCodes = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  NO_INTERNET: 'NO_INTERNET',
  
  // Auth errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  
  // Supabase errors
  SUPABASE_ERROR: 'SUPABASE_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  SUBSCRIPTION_ERROR: 'SUBSCRIPTION_ERROR',
  
  // App-specific errors
  STREAK_NOT_FOUND: 'STREAK_NOT_FOUND',
  OPERATION_FAILED: 'OPERATION_FAILED',
};

const UserFriendlyMessages = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  TIMEOUT: 'Request timed out. Please try again.',
  NO_INTERNET: 'No internet connection. Some features may be unavailable.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  INVALID_INPUT: 'Invalid input provided.',
  DUPLICATE_ENTRY: 'This item already exists.',
  SUPABASE_ERROR: 'Database error. Please try again later.',
  DATABASE_ERROR: 'Database error. Please try again later.',
  SUBSCRIPTION_ERROR: 'Connection error. Retrying...',
  STREAK_NOT_FOUND: 'Streak not found.',
  OPERATION_FAILED: 'Operation failed. Please try again.',
};

/**
 * Parse various error types into AppError
 */
export const parseError = (error, context = '') => {
  console.error(`[${context}]`, error);

  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }

  // Network/Fetch errors
  if (error instanceof TypeError || error.message === 'Failed to fetch') {
    if (!navigator.onLine) {
      return new AppError(
        UserFriendlyMessages.NO_INTERNET,
        ErrorCodes.NO_INTERNET,
        0,
        { originalError: error }
      );
    }
    return new AppError(
      UserFriendlyMessages.NETWORK_ERROR,
      ErrorCodes.NETWORK_ERROR,
      0,
      { originalError: error }
    );
  }

  // Timeout
  if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
    return new AppError(
      UserFriendlyMessages.TIMEOUT,
      ErrorCodes.TIMEOUT,
      408,
      { originalError: error }
    );
  }

  // Supabase errors
  if (error.status) {
    if (error.status === 401) {
      return new AppError(
        UserFriendlyMessages.UNAUTHORIZED,
        ErrorCodes.UNAUTHORIZED,
        401,
        { originalError: error }
      );
    }
    if (error.status === 403) {
      return new AppError(
        UserFriendlyMessages.FORBIDDEN,
        ErrorCodes.FORBIDDEN,
        403,
        { originalError: error }
      );
    }
    if (error.status >= 500) {
      return new AppError(
        UserFriendlyMessages.SUPABASE_ERROR,
        ErrorCodes.SUPABASE_ERROR,
        error.status,
        { originalError: error }
      );
    }
  }

  // Validation errors
  if (error.code === 'VALIDATION_ERROR' || error.name === 'ValidationError') {
    return new AppError(
      UserFriendlyMessages.VALIDATION_ERROR,
      ErrorCodes.VALIDATION_ERROR,
      400,
      { originalError: error, fields: error.fields }
    );
  }

  // Generic fallback
  return new AppError(
    error.message || 'An unexpected error occurred',
    ErrorCodes.OPERATION_FAILED,
    500,
    { originalError: error }
  );
};

/**
 * Retry with exponential backoff
 */
export const withRetry = async (
  fn,
  options = {}
) => {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    retryableErrors = [
      ErrorCodes.NETWORK_ERROR,
      ErrorCodes.TIMEOUT,
      ErrorCodes.SUBSCRIPTION_ERROR,
    ],
  } = options;

  let lastError;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof AppError ? error : parseError(error, 'withRetry');

      const isRetryable = 
        retryableErrors.includes(lastError.code) && 
        attempt < maxAttempts;

      if (!isRetryable) {
        throw lastError;
      }

      console.log(
        `⏱️ Retry attempt ${attempt}/${maxAttempts} after ${delay}ms: ${lastError.code}`
      );

      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError;
};

/**
 * Handle async operation with proper error handling
 */
export const executeWithErrorHandling = async (
  fn,
  options = {}
) => {
  const {
    onError,
    context = 'Operation',
    retry = false,
    retryOptions = {},
  } = options;

  try {
    if (retry) {
      return await withRetry(fn, retryOptions);
    }
    return await fn();
  } catch (error) {
    const appError = error instanceof AppError ? error : parseError(error, context);
    
    if (onError) {
      onError(appError);
    }

    throw appError;
  }
};

/**
 * Validate input based on schema
 */
export const validateInput = (data, schema) => {
  const errors = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Required check
    if (rules.required && (!value || value.trim?.() === '')) {
      errors[field] = `${field} is required`;
      continue;
    }

    // Type check
    if (value && rules.type && typeof value !== rules.type) {
      errors[field] = `${field} must be a ${rules.type}`;
      continue;
    }

    // Pattern/Regex check
    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.patternMessage || `${field} format is invalid`;
      continue;
    }

    // Min length check
    if (value && rules.minLength && value.length < rules.minLength) {
      errors[field] = `${field} must be at least ${rules.minLength} characters`;
      continue;
    }

    // Max length check
    if (value && rules.maxLength && value.length > rules.maxLength) {
      errors[field] = `${field} must be at most ${rules.maxLength} characters`;
      continue;
    }

    // Custom validator
    if (value && rules.validator) {
      const result = rules.validator(value);
      if (result !== true) {
        errors[field] = result || `${field} is invalid`;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    const error = new AppError(
      'Validation failed',
      ErrorCodes.VALIDATION_ERROR,
      400
    );
    error.details.fields = errors;
    throw error;
  }
};

/**
 * Create a request timeout promise
 */
export const withTimeout = (promise, ms = 30000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new AppError(
          UserFriendlyMessages.TIMEOUT,
          ErrorCodes.TIMEOUT,
          408
        )),
        ms
      )
    ),
  ]);
};
