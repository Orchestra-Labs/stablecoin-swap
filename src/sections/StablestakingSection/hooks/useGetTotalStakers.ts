import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';

import { API_LINKS, defaultChainName } from '@/constants';
import { TotalStakersResponse } from '@/sections/StablestakingSection/types/total-stakers';

const isDev = import.meta.env.VITE_PUBLIC_NODE_ENV === 'development';

export const useGetTotalStakers = () => {
  const { getRestEndpoint } = useChain(defaultChainName);

  const fetchTotalStakers = async () => {
    const restEndpoint = isDev
      ? '/test-stablestaking-rest'
      : await getRestEndpoint();
    const response = await fetch(
      `${restEndpoint}${API_LINKS.STABLESTAKING.TOTAL_STAKERS}`,
    );
    const data = await response.json();
    return data;
  };

  const rewardInfo = useQuery<TotalStakersResponse>({
    queryKey: ['staking-total-stakers'],
    queryFn: fetchTotalStakers,
  });

  return rewardInfo;
};
