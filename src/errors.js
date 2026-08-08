'use strict';

class AppError extends Error {
  constructor(code, message, status = 400, retryable = false, details = undefined) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.retryable = retryable;
    this.details = details;
  }
}

function providerError(message, status, body) {
  const retryable = status === 429 || status >= 500;
  const error = new AppError('GOOGLE_PROVIDER_ERROR', message, 502, retryable);
  error.providerStatus = status;
  error.providerBody = body;
  return error;
}

module.exports = { AppError, providerError };
