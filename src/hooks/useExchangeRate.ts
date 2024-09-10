import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import { defaultChainName } from '@/constants';
import { ReceiveAssetAtom, SendAssetAtom } from '@/sections';

interface ExchangeRateResponse {
  return_coin: {
    denom: string;
    amount: string;
  };
}

export function useExchangeRate() {
  const sendAsset = useAtomValue(SendAssetAtom)?.denom || '';
  const receiveAsset = useAtomValue(ReceiveAssetAtom)?.denom || '';
  const { getRestEndpoint } = useChain(defaultChainName);

  console.log('assets change calculate exchange', sendAsset, receiveAsset);

  const queryExchangeRate = useQuery<string | null, Error, string | null>({
    queryKey: ['exchangeRate', sendAsset, receiveAsset],
    queryFn: async ({ queryKey }): Promise<string | null> => {
      const [, sendAsset, receiveAsset] = queryKey as [string, string, string];
      if (!sendAsset || !receiveAsset) return null;

      const restEndpoint = await getRestEndpoint();

      const response = await fetch(
        `${restEndpoint}/osmosis/market/v1beta1/swap?offerCoin=1000000${sendAsset}&askDenom=${receiveAsset}`,
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
      return new BigNumber(queryExchangeRate.data)
        .dividedBy(1000000)
        .toNumber(); // Return as string with 6 decimal places
    }
    return 0;
  }, [queryExchangeRate.data]);

  console.log('exchange rate:', exchangeRate);

  return {
    isLoading: queryExchangeRate.isLoading,
    error: queryExchangeRate.error,
    exchangeRate,
  };
}
