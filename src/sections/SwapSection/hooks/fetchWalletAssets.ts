import { Asset, WalletAssets } from '../types';

export const fetchWalletAssets = async (
  rpcUrl: string,
  walletAddress: string,
): Promise<WalletAssets | null> => {
  try {
    // Fetch balances from the provided API
    const response = await fetch(
      `${rpcUrl}/cosmos/bank/v1beta1/spendable_balances/${walletAddress}`,
    );
    const data = await response.json();
    console.log(data);

    // Extract assets from the balances
    const assets: Asset[] = data.balances.map(
      (balance: { denom: string; amount: string }) => ({
        denom: balance.denom,
        amount: balance.amount,
      }),
    );

    return {
      address: walletAddress,
      assets,
    };
  } catch (error) {
    console.error('Error fetching chain data:', error);
    return null;
  }
};
