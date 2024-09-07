import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { rpcUrl } from '@/constants';

interface ExchangeRateResponse {
  return_coin: {
    denom: string;
    amount: string;
  };
}

export function useExchangeRate(sendAsset: string, receiveAsset: string) {
  const queryExchangeRate = useQuery<string | null, Error, string | null>({
    queryKey: ['exchangeRate', sendAsset, receiveAsset],
    queryFn: async ({ queryKey }): Promise<string | null> => {
      const [, sendAsset, receiveAsset] = queryKey as [string, string, string];
      if (!sendAsset || !receiveAsset) return null;

      const response = await fetch(
        `${rpcUrl}/osmosis/market/v1beta1/swap?offerCoin=1000000${sendAsset}&askDenom=${receiveAsset}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: ExchangeRateResponse = await response.json();
      return data.return_coin.amount;
    },
    enabled: !!sendAsset && !!receiveAsset,
    staleTime: 30000, // Consider the data stale after 30 seconds
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const exchangeRate = useMemo(() => {
    if (queryExchangeRate.data) {
      // Use BigNumber for precise decimal arithmetic
      const rate = new BigNumber(queryExchangeRate.data).dividedBy(1000000);
      return rate.toFixed(6); // Return as string with 6 decimal places
    }
    return null;
  }, [queryExchangeRate.data]);

  return {
    isLoading: queryExchangeRate.isLoading,
    error: queryExchangeRate.error,
    exchangeRate: exchangeRate,
  };
}