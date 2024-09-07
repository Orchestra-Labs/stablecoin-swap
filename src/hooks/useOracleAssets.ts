import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { defaultChainName } from '@/constants';
import { Asset } from '@/sections';

export function useOracleAssets() {
  const { getRestEndpoint } = useChain(defaultChainName);

  const queryAssets = useQuery<Asset[]>({
    queryKey: ['oracleAssets'],
    queryFn: async () => {
      const restEndpoint = await getRestEndpoint();
      const response = await fetch(
        `${restEndpoint}/osmosis/oracle/v1beta1/denoms/exchange_rates`,
      );
      const data = await response.json();
      const assetsWithNative = [
        ...data.exchange_rates,
        {
          denom: 'note',
          amount: '1.0',
        },
      ];
      return assetsWithNative;
    },
  });

  const assets = useMemo(() => queryAssets.data, [queryAssets.data]);

  return {
    isLoading: queryAssets.isLoading,
    error: queryAssets.error,
    assets: assets ?? [],
  };
}
