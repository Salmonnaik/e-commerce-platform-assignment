export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPassword(password: string, minLength = 8): boolean {
  return password.length >= minLength;
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

export function isValidPostalCode(postalCode: string): boolean {
  return /^[A-Za-z0-9\s-]{3,10}$/.test(postalCode.trim());
}

export function isPositiveNumber(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function isNonEmptyString(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidPrice(price: number): boolean {
  return Number.isFinite(price) && price >= 0;
}

export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity > 0;
}
