import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { defaultChainName, rpcUrl } from '@/constants';

import { useAsset } from './useAsset';

// Function to resolve IBC denom
const resolveIbcDenom = async (ibcDenom: string): Promise<string> => {
  try {
    const denomHash = ibcDenom.slice(4); // Remove the "ibc/" prefix
    const response = await fetch(
      `${rpcUrl}/ibc/apps/transfer/v1/denom_traces/${denomHash}`,
    );
    const data = await response.json();
    const baseDenom = data.denom_trace?.base_denom;
    if (!baseDenom) {
      throw new Error(`Failed to resolve IBC denom: ${ibcDenom}`);
    }
    return baseDenom;
  } catch (error) {
    console.error(`Error resolving IBC denom ${ibcDenom}:`, error);
    throw error;
  }
};

export function useWalletAssets() {
  const {
    address: walletAddress,
    isWalletConnected,
    getStargateClient,
  } = useChain(defaultChainName);
  const { find } = useAsset(defaultChainName);
  const assetsQuery = useQuery({
    queryKey: ['walletAssets', walletAddress],
    enabled: isWalletConnected,
    queryFn: async () => {
      if (!walletAddress) throw new Error('Wallet address is required');
      const client = await getStargateClient();
      const coins = await client.getAllBalances(walletAddress);
      return coins.map(coin => {
        const registryAsset = find(coin.denom);
        return {
          denom: coin.denom,
          amount: coin.amount,
          isIbc: coin.denom.startsWith('ibc/'),
          logo: registryAsset?.logo_URIs?.png ?? registryAsset?.logo_URIs?.jpeg,
        };
      });
    },
  });

  const walletAssets = useMemo(() => assetsQuery.data, [assetsQuery.data]);

  const resolvedAddressesQuery = useQuery({
    queryKey: ['resolvedAddresses', walletAssets],
    enabled: !!walletAssets,
    queryFn: async () => {
      const resolvedAssets = await Promise.all(
        walletAssets!.map(async asset => {
          if (asset.isIbc) {
            const resolvedDenom = await resolveIbcDenom(asset.denom);
            return { ...asset, denom: resolvedDenom };
          }
          return asset;
        }),
      );
      return resolvedAssets;
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allQueries = {
    assets: assetsQuery,
    resolvedAddresses: resolvedAddressesQuery,
  };

  const updatableQueriesAfterMutation = [assetsQuery, resolvedAddressesQuery];

  const isInitialFetching = Object.values(allQueries).some(
    ({ isLoading }) => isLoading,
  );

  const isDoingRefetching = Object.values(allQueries).some(
    ({ isRefetching }) => isRefetching,
  );

  const isLoading = isInitialFetching || isDoingRefetching;

  type AllQueries = typeof allQueries;

  type QueriesData = {
    [Key in keyof AllQueries]: NonNullable<AllQueries[Key]['data']>;
  };

  const data = useMemo(() => {
    if (isLoading) return;

    // eslint-disable-next-line consistent-return
    return Object.fromEntries(
      Object.entries(allQueries).map(([key, query]) => [key, query.data]),
    ) as QueriesData;
  }, [allQueries, isLoading]);

  const refetch = () => {
    console.log('refresh wallet');
    updatableQueriesAfterMutation.forEach(query => query.refetch());
  };

  return {
    isLoading,
    error: assetsQuery.error || resolvedAddressesQuery.error,
    data,
    refetch,
  };
}
