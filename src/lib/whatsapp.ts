export function normalizePhoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function whatsAppLink(number: string, message?: string) {
  const digits = normalizePhoneDigits(number);
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function whatsAppDisplay(number: string) {
  const digits = normalizePhoneDigits(number);
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return `+${digits}`;
}
