export function truncate(text: string, maxLength: number, suffix = '…'): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - suffix.length)}${suffix}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatEnumLabel(value: string): string {
  return value
    .split('_')
    .map((part) => capitalize(part))
    .join(' ');
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function formatOrderNumber(orderNumber: string): string {
  return orderNumber.startsWith('#') ? orderNumber : `#${orderNumber}`;
}
