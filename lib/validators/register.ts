export type RegisterFormValues = {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts digits, spaces, and the usual phone punctuation; requires
// at least 7 digits so a stray "-" or "()" alone doesn't pass.
const PHONE_PATTERN = /^[+()\d][\d\s()+-]{6,}$/;

// Returns the first validation error found, or null if the form is valid.
export function validateRegisterForm(values: RegisterFormValues): string | null {
  if (!values.firstName.trim()) {
    return "First name is required.";
  }
  if (!values.lastName.trim()) {
    return "Last name is required.";
  }
  if (!values.phone.trim()) {
    return "Phone number is required.";
  }
  if (!PHONE_PATTERN.test(values.phone.trim())) {
    return "Enter a valid phone number.";
  }
  if (!values.email.trim()) {
    return "Email is required.";
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    return "Enter a valid email address.";
  }
  if (values.password.length < 8) {
    return "Password needs at least 8 characters.";
  }
  if (values.password !== values.confirmPassword) {
    return "Passwords don't match.";
  }
  return null;
}