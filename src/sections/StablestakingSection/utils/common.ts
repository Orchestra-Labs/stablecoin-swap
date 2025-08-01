export const formatDuration = (input: string): string => {
  const seconds = parseInt(input.replace('s', ''), 10);

  if (isNaN(seconds)) return '';

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);

  if (seconds < 3600) {
    return `${minutes} min`;
  }
  if (seconds < 86400) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  return `${days} day${days !== 1 ? 's' : ''}`;
};

export const removeTrailingZeroes = (num: string | number): string => {
  const numberString = String(num);
  const cleanedNumber = parseFloat(numberString).toString();

  return cleanedNumber;
};

export const formatNumberWithCommas = (value: string | number): string => {
  const stringValue = String(value);
  const [integerPart, decimalPart] = stringValue.split('.') || ['', ''];
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ',',
  );
  const formattedNumber =
    decimalPart !== undefined
      ? `${formattedIntegerPart}.${decimalPart}`
      : formattedIntegerPart;

  return formattedNumber;
};

export const formatBalanceDisplay = (
  number: string,
  symbol: string,
): string => {
  // Remove non-numeric characters except for the decimal point
  const cleanedNumber = number.replace(/[^\d.]/g, '');

  // Separate integer part and fractional part (if any)
  const [integerPart, fractionalPart] = cleanedNumber.split('.');

  // Count total digits and calculate how many digits can be kept after the decimal
  const remainingDigits = 7 - integerPart.length;

  const returnInteger = integerPart.length >= 7 || !fractionalPart;
  // Combine integer and truncated fractional part to maintain up to 7 digits
  const stringToFormat = returnInteger
    ? integerPart
    : `${integerPart}.${fractionalPart.slice(0, remainingDigits)}`;

  const formattedAmount = formatNumberWithCommas(
    removeTrailingZeroes(stringToFormat),
  );
  return `${formattedAmount} ${symbol}`;
};

export const convertToGreaterUnit = (
  amount: number,
  exponent: number,
): number => {
  return amount / 10 ** exponent;
};
