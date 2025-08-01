import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';

import { API_LINKS, defaultChainName } from '@/constants';
import { UserUnbondingResponse } from '@/sections/StablestakingSection/types/user-unbounding';

const isDev = import.meta.env.VITE_PUBLIC_NODE_ENV === 'development';

export const useGetUserUnboundingByDenom = (denom: string) => {
  const { address, getRestEndpoint } = useChain(defaultChainName);

  const fetchUserUnbounding = async () => {
    const restEndpoint = isDev
      ? '/test-stablestaking-rest'
      : await getRestEndpoint();
    const response = await fetch(
      `${restEndpoint}${API_LINKS.STABLESTAKING.USER_UNBOUNDING}?address=${address}&denom=${denom}`,
    );
    const res = await response.json();
    return res;
  };

  const data = useQuery<UserUnbondingResponse>({
    queryKey: ['staking-user-unbounding', address, denom],
    queryFn: fetchUserUnbounding,
  });

  return data;
};
