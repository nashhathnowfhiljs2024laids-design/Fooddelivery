export const isValidUpi = (upi) => {
  if (!upi || typeof upi !== 'string') return false;

  const trimmed = upi.trim();
  if (!trimmed.includes('@')) return false;

  const [user, provider] = trimmed.split('@');
  if (!user || !provider) return false;
  if (provider.includes('@')) return false;

  const userRegex = /^[a-zA-Z0-9._-]{2,}$/;
  const providerRegex = /^[a-zA-Z]{3,}$/;

  return userRegex.test(user) && providerRegex.test(provider);
};

export const isValidCardNumber = (value) => {
  if (!value || typeof value !== 'string') return false;

  const digits = value.replaceAll(/\s+/g, '');
  if (!/^\d{16}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 16; i += 1) {
    let digit = Number.parseInt(digits.charAt(15 - i), 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }

  return sum % 10 === 0;
};

export const isValidExpiry = (value) => {
  if (!value || typeof value !== 'string') return false;

  const trimmed = value.trim();
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(trimmed);
  if (!match) return false;

  const month = Number.parseInt(match[1], 10);
  const year = Number.parseInt(match[2], 10);
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  return year > currentYear || (year === currentYear && month >= currentMonth);
};

export const isValidCvv = (value) => {
  if (!value || typeof value !== 'string') return false;
  return /^\d{3}$/.test(value.trim());
};
