import { TextConstants } from "@/constant/text";

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

export const generateErrorMessages = (response: {
  is_valid_cvv: boolean;
  is_valid_expiration: boolean;
  is_valid_luhn: boolean;
  valid_card_data: boolean;
}): string[] => {
  const errors: string[] = [];

  if (!response.is_valid_luhn) {
    errors.push(TextConstants.errors.invalid_luhn);
  }
  if (!response.is_valid_cvv) {
    errors.push(TextConstants.errors.invalid_cvv);
  }
  if (!response.is_valid_expiration) {
    errors.push(TextConstants.errors.invalid_expiration);
  }
  if (!response.valid_card_data || errors.length > 1 || errors.length === 0) {
    return [TextConstants.errors.generic_card_error_message];
  }

  return errors;
};

/**
 * Determines the card type based on the card number.
 * @param cardNumber - The card number as a string.
 * @returns The card type ('visa', 'mastercard', or null).
 */
export const getCardType = (cardNumber: string): 'visa' | 'mastercard' | null => {
  if (!cardNumber) return null;

  // Remove all non-digit characters
  const sanitizedNumber = cardNumber.replace(/\D/g, '');

  // Check for Visa (starts with 4)
  if (/^4/.test(sanitizedNumber)) {
    return 'visa';
  }

  // Check for Mastercard (starts with 51–55 or 2221–2720)
  if (
    /^5[1-5]/.test(sanitizedNumber) || // Mastercard BIN range 51–55
    /^2(2[2-9][1-9]|2[3-9]|[3-6]|7[01]|720)/.test(sanitizedNumber) // Mastercard BIN range 2221–2720
  ) {
    return 'mastercard';
  }

  return null;
};


/**
 * Checks if a credit card expiration date is expired.
 * @param expirationDate - The expiration date in MM/YY format.
 * @returns `true` if the card is expired, `false` otherwise.
 */
export const isCardExpired = (expirationDate: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
    return true
  }

  const [month, year] = expirationDate.split('/').map(Number);
  if (month < 1 || month > 12) {
    return true
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Last two digits of the current year
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-based

  // Check if the year is expired
  if (year < currentYear) return true;

  // If the year is the same, check the month
  if (year === currentYear && month < currentMonth) return true;

  return false;
};
