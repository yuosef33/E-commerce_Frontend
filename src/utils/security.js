/**
 * Security utilities for input sanitization and validation.
 * Prevents XSS by stripping dangerous characters from user inputs.
 */

// Strip HTML tags and dangerous characters
export function sanitize(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Strip HTML but keep the plain text (for inputs before sending to API)
export function stripHtml(input) {
  if (typeof input !== 'string') return input;
  return input.replace(/<[^>]*>/g, '').trim();
}

// Validation patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const NAME_REGEX = /^[a-zA-Z\s\-'.]{2,50}$/;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

export function isValidPhone(phone) {
  return PHONE_REGEX.test(phone);
}

export function isValidName(name) {
  return NAME_REGEX.test(name);
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8 && password.length <= 128;
}

// Sanitize an object's string values (for API payloads)
export function sanitizePayload(obj) {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = typeof value === 'string' ? stripHtml(value) : value;
  }
  return sanitized;
}

// Sanitize search/URL parameters
export function sanitizeSearchParam(param) {
  if (typeof param !== 'string') return '';
  return param.replace(/[<>"'`;(){}]/g, '').trim().substring(0, 200);
}
