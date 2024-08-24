import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { defaultChainName, rpcUrl } from '@/constants';
import { useChain } from '@cosmos-kit/react';
import { Asset } from '@/sections';

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
  const { address: walletAddress, isWalletConnected } =
    useChain(defaultChainName);
  const assetsQuery = useQuery({
    queryKey: ['walletAssets', walletAddress],
    enabled: isWalletConnected,
    queryFn: async () => {
      const response = await fetch(
        `${rpcUrl}/cosmos/bank/v1beta1/spendable_balances/${walletAddress}`,
      );
      const data = await response.json();

      // Extract assets from the balances
      const assets: Asset[] = data.balances.map(
        (balance: { denom: string; amount: string }) => ({
          denom: balance.denom,
          amount: balance.amount,
          isIbc: balance.denom.startsWith('ibc/'),
        }),
      );

      return assets;
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
