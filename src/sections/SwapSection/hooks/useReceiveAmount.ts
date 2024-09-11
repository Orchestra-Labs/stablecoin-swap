import { useAtomValue } from 'jotai';

import { useExchangeRate } from '@/hooks';
import { calculateReceiveAmount } from '../utils/swapCalculation';
import BigNumber from 'bignumber.js';
import { SendAmountAtom } from '../atoms';

export const useReceiveAmount = () => {
  const { exchangeRate, isLoading, error } = useExchangeRate();
  const sendAmount = useAtomValue(SendAmountAtom);

  const receiveAmount = calculateReceiveAmount(
    sendAmount,
    BigNumber(exchangeRate),
  ).toNumber();

  return {
    receiveAmount: receiveAmount,
    isLoading,
    error,
  };
};
