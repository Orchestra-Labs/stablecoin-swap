import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';

import { API_LINKS, defaultChainName } from '@/constants';
import { TopStakersResponse } from '@/sections/StablestakingSection/types/top-stakers';

const isDev = import.meta.env.VITE_PUBLIC_NODE_ENV === 'development';

export const useGetTopStakers = (denom: string) => {
  const { getRestEndpoint } = useChain(defaultChainName);

  const fetchTopStakers = async () => {
    const restEndpoint = isDev
      ? '/test-stablestaking-rest'
      : await getRestEndpoint();
    const response = await fetch(
      `${restEndpoint}${API_LINKS.STABLESTAKING.TOP_STAKERS}?denom=${denom}`,
    );
    const res = await response.json();
    return res;
  };

  const data = useQuery<TopStakersResponse>({
    queryKey: ['staking-top-stakers', denom],
    queryFn: fetchTopStakers,
  });

  return data;
};
