import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';

import { API_LINKS, defaultChainName } from '@/constants';
import { StablePoolsResponse } from '@/sections/StablestakingSection/types/stable-pools';

const isDev = import.meta.env.VITE_PUBLIC_NODE_ENV === 'development';

export const useGetStablePools = () => {
  const { getRestEndpoint } = useChain(defaultChainName);

  const fetchStablePools = async () => {
    const restEndpoint = isDev
      ? '/test-stablestaking-rest'
      : await getRestEndpoint();
    const response = await fetch(
      `${restEndpoint}${API_LINKS.STABLESTAKING.STABLE_POOLS}`,
    );
    const res = await response.json();
    return res;
  };

  const data = useQuery<StablePoolsResponse>({
    queryKey: ['staking-stable-pools'],
    queryFn: fetchStablePools,
  });

  return data;
};
