//
// PUBLIC_INTERFACE
// Basic validators for form fields
//

// PUBLIC_INTERFACE
export function required(value) {
  /** Returns an error message if value is empty, otherwise empty string */
  if (value === null || value === undefined) return 'This field is required';
  if (typeof value === 'string' && value.trim() === '') return 'This field is required';
  return '';
}

// PUBLIC_INTERFACE
export function email(value) {
  /** Simple email validation; returns error string or empty if valid */
  if (!value) return '';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(value).toLowerCase()) ? '' : 'Invalid email address';
}

// PUBLIC_INTERFACE
export function minLength(value, min) {
  /** Check minimum length for strings */
  if (!value) return '';
  return String(value).trim().length < min ? `Must be at least ${min} characters` : '';
}

// PUBLIC_INTERFACE
export function maxLength(value, max) {
  /** Check maximum length for strings */
  if (!value) return '';
  return String(value).trim().length > max ? `Must be at most ${max} characters` : '';
}
