import { useAtomValue } from 'jotai';
import { useExchangeRate } from '@/hooks';
import { calculateReceiveAmount } from '../utils/swapCalculation';
import BigNumber from 'bignumber.js';
import { SendStateAtom } from '../atoms';

export const useReceiveAmount = () => {
  const { exchangeRate, isLoading, error } = useExchangeRate();

  // Use the combined send state atom to get the send amount
  const sendState = useAtomValue(SendStateAtom);
  const sendAmount = sendState.amount;

  const receiveAmount = calculateReceiveAmount(
    sendAmount,
    BigNumber(exchangeRate),
  ).toNumber();

  return {
    receiveAmount,
    isLoading,
    error,
  };
};
