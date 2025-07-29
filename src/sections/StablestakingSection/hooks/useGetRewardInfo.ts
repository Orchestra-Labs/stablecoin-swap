import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';

import { API_LINKS, defaultChainName } from '@/constants';
import { StablestakingRewardInfo } from '@/sections/StablestakingSection/types/reward-info';

const isDev = import.meta.env.VITE_PUBLIC_NODE_ENV === 'development';

export const useGetRewardInfo = () => {
  const { getRestEndpoint } = useChain(defaultChainName);

  const fetchRewardInfo = async () => {
    const restEndpoint = isDev
      ? '/test-stablestaking-rest'
      : await getRestEndpoint();
    const response = await fetch(
      `${restEndpoint}${API_LINKS.STABLESTAKING.REWARD_AMOUNT_PER_POOL}?denom=uusd`,
    );
    const data = await response.json();
    return data;
  };

  const rewardInfo = useQuery<StablestakingRewardInfo>({
    queryKey: ['staking-reward-info'],
    queryFn: fetchRewardInfo,
  });

  return rewardInfo;
};
