import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';

import { API_LINKS, defaultChainName } from '@/constants';
import { StablestakingParams } from '@/sections/StablestakingSection/types/params';

const isDev = import.meta.env.VITE_PUBLIC_NODE_ENV === 'development';

export const useGetParams = () => {
  const { getRestEndpoint } = useChain(defaultChainName);

  const fetchParams = async () => {
    const restEndpoint = isDev
      ? '/test-stablestaking-rest'
      : await getRestEndpoint();
    const response = await fetch(
      `${restEndpoint}${API_LINKS.STABLESTAKING.PARAMS}`,
    );
    const data = await response.json();
    return data;
  };

  const rewardInfo = useQuery<StablestakingParams>({
    queryKey: ['staking-params'],
    queryFn: fetchParams,
  });

  return rewardInfo;
};
