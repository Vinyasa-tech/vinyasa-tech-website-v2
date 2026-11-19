
export function validateName(name: string): string {
  const value = name.trim();

  if (!value) return "Full name is required.";

  if (value.length < 2 || value.length > 80) {
    return "Name must be between 2 and 80 characters.";
  }

  // Letters, spaces, apostrophes and hyphens are allowed.
  if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(value)) {
    return "Name must contain letters only, with spaces or hyphens allowed.";
  }

  return "";
}

export function validateMobile(phone: string): string {
  if (!phone) return "Mobile number is required.";

  // Indian mobile number: 10 digits, starting with 6, 7, 8 or 9.
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return "Enter a valid 10-digit Indian mobile number.";
  }

  return "";
}

export function validateEmail(email: string): string {
  const value = email.trim();

  if (!value) return "Email address is required.";

  if (/\s/.test(value)) {
    return "Email must not contain spaces.";
  }

  if (
    value.length > 254 ||
    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
  ) {
    return "Enter a valid email address.";
  }

  return "";
}
