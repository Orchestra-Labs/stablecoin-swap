import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { connectKeplr } from '@/sections';

export function useKeplr() {
  const query = useQuery({
    queryKey: ['connectKeplr'],
    queryFn: async () => {
      const signer = await connectKeplr('symphony-testnet-3');
      const accounts = await signer!.getAccounts();
      const walletAddress = accounts[0].address;
      return {
        isConnected: !!signer,
        walletAddress,
      };
    },
  });

  const data = useMemo(() => query.data, [query.data]);

  return {
    isLoading: query.isLoading,
    error: query.error,
    data,
  };
}
