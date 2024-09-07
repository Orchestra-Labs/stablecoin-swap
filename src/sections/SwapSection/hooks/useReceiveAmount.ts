import { useAtomValue } from 'jotai';

import { useExchangeRate } from '@/hooks';
import { SendAmountAtom } from '@/sections/SwapSection/atoms/SendAmountAtom';

export const useReceiveAmount = () => {
  const { exchangeRate, isLoading, error } = useExchangeRate();
  const sendAmount = useAtomValue(SendAmountAtom);

  return {
    receiveAmount: sendAmount * exchangeRate,
    isLoading,
    error,
  };
};
