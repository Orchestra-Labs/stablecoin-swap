import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { defaultChainName, rpcUrl } from '@/constants';


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
  const assetsQuery = useQuery({
    queryKey: ['walletAssets', walletAddress],
    enabled: isWalletConnected,
    queryFn: async () => {
      if (!walletAddress) throw new Error('Wallet address is required');
      const client = await getStargateClient();
      const coins = await client.getAllBalances(walletAddress);
      return coins.map(coin => {
        return {
          denom: coin.denom,
          amount: coin.amount,
          isIbc: coin.denom.startsWith('ibc/'),
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

  const resolvedAssets = useMemo(
    () => resolvedAddressesQuery.data,
    [resolvedAddressesQuery.data],
  );

  return {
    isLoading: assetsQuery.isLoading || resolvedAddressesQuery.isLoading,
    error: assetsQuery.error || resolvedAddressesQuery.error,
    data: resolvedAssets ?? [],
  };
}
