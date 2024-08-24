import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { rpcUrl } from '@/constants';
import { Asset } from '@/sections';

export function useOracleAssets() {
  const queryAssets = useQuery<Asset[]>({
    queryKey: ['oracleAssets'],
    queryFn: async () => {
      const response = await fetch(
        `${rpcUrl}/osmosis/oracle/v1beta1/denoms/exchange_rates`,
      );
      const data = await response.json();
      return data.exchange_rates;
    },
  });

  const assets = useMemo(() => queryAssets.data, [queryAssets.data]);

  return {
    isLoading: queryAssets.isLoading,
    error: queryAssets.error,
    assets: assets ?? [],
  };
}
