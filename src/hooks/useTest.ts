import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';

import { defaultChainName } from '@/constants';

export function useTest() {
  const {
    address: walletAddress,
    isWalletConnected,
    getStargateClient,
  } = useChain(defaultChainName);

  const query = useQuery({
    queryKey: ['test', walletAddress],
    enabled: isWalletConnected,
    queryFn: async () => {
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
