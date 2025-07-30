import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';

import { API_LINKS, defaultChainName } from '@/constants';
import { TotalUserStakes } from '@/sections/StablestakingSection/types/user-stake';

const isDev = import.meta.env.VITE_PUBLIC_NODE_ENV === 'development';

export const useGetTotalUserStake = () => {
  const { address, getRestEndpoint } = useChain(defaultChainName);

  const fetchTotalUserStake = async () => {
    const restEndpoint = isDev
      ? '/test-stablestaking-rest'
      : await getRestEndpoint();
    const response = await fetch(
      `${restEndpoint}${API_LINKS.STABLESTAKING.USER_TOTAL_STAKE}?address=${address}`,
    );
    const res = await response.json();
    return res;
  };

  const data = useQuery<TotalUserStakes>({
    queryKey: ['staking-total-user-stake', address],
    queryFn: fetchTotalUserStake,
  });

  return data;
};
