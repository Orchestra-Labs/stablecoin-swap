import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';

import { API_LINKS, defaultChainName } from '@/constants';
import { UserStake } from '@/sections/StablestakingSection/types/user-stake';

const isDev = import.meta.env.VITE_PUBLIC_NODE_ENV === 'development';

export const useGetUserStakeByDenom = (denom: string) => {
  const { address, getRestEndpoint } = useChain(defaultChainName);

  const fetchUserStake = async () => {
    const restEndpoint = isDev
      ? '/test-stablestaking-rest'
      : await getRestEndpoint();
    const response = await fetch(
      `${restEndpoint}${API_LINKS.STABLESTAKING.USER_STAKE}?address=${address}&denom=${denom}`,
    );
    const res = await response.json();
    return res;
  };

  const data = useQuery<UserStake>({
    queryKey: ['staking-user-stake', address, denom],
    queryFn: fetchUserStake,
  });

  return data;
};
