import { StargateClient } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { Asset, ChainData } from '../types';

export const fetchChainData = async (
  rpcUrl: string,
  signer: OfflineSigner,
): Promise<ChainData | null> => {
  try {
    // Get the accounts from the signer
    const accounts = await signer.getAccounts();
    const cosmosAddress = accounts[0].address;

    // Fetch balances from the provided API
    const response = await fetch(
      `${rpcUrl}/osmosis/bank/v1beta1/balances/${cosmosAddress}`,
    );
    const data = await response.json();
    console.log(data);

    // Get the balances using the queryClient
    const queryClient = await StargateClient.connect(rpcUrl);
    const balances = await queryClient.getAllBalances(cosmosAddress);
    console.log(balances);

    // Extract assets from the balances
    const assets: Asset[] = balances.map(
      (balance: { denom: string; amount: string }) => ({
        denom: balance.denom,
        amount: balance.amount,
      }),
    );

    return {
      address: cosmosAddress,
      assets,
    };
  } catch (error) {
    console.error('Error fetching chain data:', error);
    return null;
  }
};
