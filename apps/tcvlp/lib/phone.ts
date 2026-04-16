/** Strip everything except digits from a phone string */
export function stripPhone(value: string): string {
  return value.replace(/[^\d]/g, '');
}

/** Format a digit-only phone string for display */
export function formatPhone(value: string): string {
  const digits = stripPhone(value);
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return value; // return as-is if not a standard US number
}

/** Allow only phone-safe characters during input */
export function filterPhoneInput(value: string): string {
  return value.replace(/[^\d\s\-()+ ]/g, '');
}
