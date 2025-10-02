import { NextResponse } from 'next/server';

// Centralized error handling for production
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429);
  }
}

// Production error logger
export function logError(error: Error | AppError, context?: string) {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // In production, log to external service (e.g., Sentry, LogRocket)
    console.error(`[${new Date().toISOString()}] ${context || 'App Error'}:`, {
      message: error.message,
      stack: error.stack,
      statusCode: error instanceof AppError ? error.statusCode : 500,
    });
  } else {
    // In development, log to console
    console.error(`[${context || 'App Error'}]`, error);
  }
}

// Global error handler
export function handleError(error: Error | AppError): { message: string; statusCode: number } {
  logError(error);

  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  // Handle unexpected errors
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    message: isProduction ? 'Internal server error' : error.message,
    statusCode: 500,
  };
}

export class ApiError extends Error {
  statusCode: number;
  errors?: any[];

  constructor(statusCode: number, message: string, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    
    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;
    
    // This clips the constructor invocation from the stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  toJson() {
    return {
      success: false,
      message: this.message,
      ...(this.errors && { errors: this.errors }),
    };
  }
}

export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return NextResponse.json(
      error.toJson(),
      { status: error.statusCode }
    );
  }
  
  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
  
  return NextResponse.json(
    {
      success: false,
      message: 'An unknown error occurred',
    },
    { status: 500 }
  );
};

export const notFound = (message = 'Resource not found') => {
  return new ApiError(404, message);
};

export const badRequest = (message = 'Bad Request', errors?: any[]) => {
  return new ApiError(400, message, errors);
};

export const unauthorized = (message = 'Unauthorized') => {
  return new ApiError(401, message);
};

export const forbidden = (message = 'Forbidden') => {
  return new ApiError(403, message);
};

export const serverError = (message = 'Internal Server Error') => {
  return new ApiError(500, message);
};

export const conflict = (message = 'Resource already exists') => {
  return new ApiError(409, message);
};
