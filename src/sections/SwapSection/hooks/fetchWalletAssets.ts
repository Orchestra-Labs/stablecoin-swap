import { Asset, WalletAssets } from '../types';

export const fetchWalletAssets = async (
  rpcUrl: string,
  walletAddress: string,
): Promise<WalletAssets | null> => {
  try {
    const response = await fetch(
      `${rpcUrl}/cosmos/bank/v1beta1/spendable_balances/${walletAddress}`,
    );
    const data = await response.json();

    const assets: Asset[] = data.balances.map(
      (balance: { denom: string; amount: string }) => ({
        denom: balance.denom,
        amount: balance.amount,
        isIbc: balance.denom.startsWith('ibc/'), // Set the isIbc flag
      }),
    );

    const resolvedAssets = await Promise.all(
      assets.map(async asset => {
        if (asset.isIbc) {
          const resolvedDenom = await resolveIbcDenom(rpcUrl, asset.denom);
          console.log(`Resolved IBC denom ${asset.denom} to ${resolvedDenom}`);
          return { ...asset, denom: resolvedDenom };
        }
        return asset;
      }),
    );

    console.log('Resolved assets:', resolvedAssets);

    return {
      address: walletAddress,
      assets: resolvedAssets,
    };
  } catch (error) {
    console.error('Error fetching chain data:', error);
    return null;
  }
};

// Function to resolve IBC denom
const resolveIbcDenom = async (
  rpcUrl: string,
  ibcDenom: string,
): Promise<string> => {
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
