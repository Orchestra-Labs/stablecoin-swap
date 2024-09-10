import { walletPrefix } from '@/constants';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs, { strict: false }));
};

export const hashToHumanReadable = (hashString: string) => {
  const prefix = hashString.startsWith(walletPrefix) ? walletPrefix : '';
  const remainingHash = prefix ? hashString.slice(prefix.length) : hashString;

  const first4 = remainingHash.slice(0, 4);
  const last4 = remainingHash.slice(-4);

  return `${prefix}${first4}...${last4}`;
};
