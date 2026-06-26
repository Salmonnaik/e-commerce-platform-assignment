export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageItem(key: string): void {
  localStorage.removeItem(key);
}

export function getStorageString(key: string): string | null {
  return localStorage.getItem(key);
}

export function setStorageString(key: string, value: string): void {
  localStorage.setItem(key, value);
}

export function clearStorageItems(keys: string[]): void {
  keys.forEach((key) => localStorage.removeItem(key));
}
