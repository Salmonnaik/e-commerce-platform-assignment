const currencyFormatters = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string, locale = 'en-US'): Intl.NumberFormat {
  const key = `${locale}-${currency}`;
  if (!currencyFormatters.has(key)) {
    currencyFormatters.set(
      key,
      new Intl.NumberFormat(locale, { style: 'currency', currency })
    );
  }
  return currencyFormatters.get(key)!;
}

export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return getFormatter(currency, locale).format(amount);
}

export function parseCurrency(value: string): number {
  const parsed = parseFloat(value.replace(/[^0-9.-]+/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function formatPriceRange(min: number, max: number, currency = 'USD'): string {
  if (min === max) return formatCurrency(min, currency);
  return `${formatCurrency(min, currency)} – ${formatCurrency(max, currency)}`;
}
