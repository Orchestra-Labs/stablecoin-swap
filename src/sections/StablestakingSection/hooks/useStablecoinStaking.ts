import { useQueryClient } from '@tanstack/react-query';

import { localAssetRegistry } from '@/constants';
import { useStablecoinStake } from '@/sections/StablestakingSection/hooks/useStablecoinStake';
import { useStablecoinUnstake } from '@/sections/StablestakingSection/hooks/useStablecoinUnstake';
import { StablecoinStakeParams } from '@/sections/StablestakingSection/types/stake';

export const useStablecoinStaking = (denom = '') => {
  const queryClient = useQueryClient();

  const handleSuccessTransaction = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['stablecoin-staking-stable-pool', denom],
    });
  };

  const { mutateAsync: stakeStablecoin, isPending: isPendingStake } =
    useStablecoinStake({
      onSuccess: handleSuccessTransaction,
    });
  const { mutateAsync: unstakeStablecoin, isPending: isPendingUnstake } =
    useStablecoinUnstake({
      onSuccess: handleSuccessTransaction,
    });

  const handleStake = async (body: StablecoinStakeParams) => {
    try {
      const feeDenom = localAssetRegistry.note.denom;

      await stakeStablecoin({ body, feeDenom });
    } catch (error) {
      console.error('Stake failed', error);
      throw error;
    }
  };

  const handleUnstake = async (body: StablecoinStakeParams) => {
    try {
      const feeDenom = localAssetRegistry.note.denom;

      await unstakeStablecoin({ body, feeDenom });
    } catch (error) {
      console.error('Unstake failed', error);
      throw error;
    }
  };

  return {
    handleStake,
    handleUnstake,
    isLoading: isPendingStake || isPendingUnstake,
  };
};
