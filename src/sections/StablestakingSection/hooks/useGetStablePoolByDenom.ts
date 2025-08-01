import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';

import { API_LINKS, defaultChainName } from '@/constants';
import { StablePoolResponse } from '@/sections/StablestakingSection/types/stable-pools';

const isDev = import.meta.env.VITE_PUBLIC_NODE_ENV === 'development';

export const useGetStablePoolByDenom = (denom: string) => {
  const { getRestEndpoint } = useChain(defaultChainName);

  const fetchStablePool = async () => {
    const restEndpoint = isDev
      ? '/test-stablestaking-rest'
      : await getRestEndpoint();
    const response = await fetch(
      `${restEndpoint}${API_LINKS.STABLESTAKING.STABLE_POOL}?denom=${denom}`,
    );
    const res = await response.json();
    return res;
  };

  const data = useQuery<StablePoolResponse>({
    queryKey: ['staking-stable-pool', denom],
    queryFn: fetchStablePool,
  });

  return data;
};
