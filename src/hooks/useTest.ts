import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';

import { defaultChainName } from '@/constants';

export function useTest() {
  const {
    address: walletAddress,
    isWalletConnected,
    getStargateClient,
    getRpcEndpoint,
    getRestEndpoint,
    chain,
  } = useChain(defaultChainName);

  const query = useQuery({
    queryKey: ['test', walletAddress],
    enabled: isWalletConnected,
    queryFn: async () => {
      console.log('rpcUrl', await getRpcEndpoint());
      console.log('restUrl', await getRestEndpoint());
      console.log('chain', chain.chain_name);
      const client = await getStargateClient();
      return client.getAllBalances(walletAddress!);
    },
  });

  return {
    isLoading: query.isLoading,
    error: query.error,
    data: query.data,
  };
}
