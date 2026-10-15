const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns an object of { fieldName: message }. Empty object means valid. */
export function validateEmployee(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Enter the employee's full name.";
  }

  if (!values.email.trim()) {
    errors.email = "Enter an email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address, like name@company.com.";
  }

  if (!values.department.trim()) {
    errors.department = "Choose or enter a department.";
  }

  if (!values.designation.trim()) {
    errors.designation = "Enter the employee's designation.";
  }

  if (!values.status) {
    errors.status = "Choose a status.";
  }

  return errors;
}
