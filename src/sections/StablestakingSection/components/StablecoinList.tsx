import { useMemo, useState } from 'react';

import { STABLECOINS_ASSETS_REGISTRY } from '@/constants';
import { StablestakingDialog } from '@/sections/StablestakingSection/components/StablestakingDialog';
import {
  useGetParams,
  useGetTotalUserStake,
} from '@/sections/StablestakingSection/hooks';
import { Button } from '@/ui-kit';

export const StablecoinList = () => {
  const { data: stakingParams } = useGetParams();
  const { data: userStake } = useGetTotalUserStake();

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    action: 'stake' | 'unstake' | null;
    denom: string;
  }>({ isOpen: false, action: null, denom: '' });

  const handleOpenDialog = (action: 'stake' | 'unstake', denom: string) => {
    setDialogState({ isOpen: true, action, denom });
  };

  const handleCloseDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  const tokens = useMemo(() => {
    if (!stakingParams) return [];

    return stakingParams.params.supported_tokens;
  }, [stakingParams]);

  const getStakedAmount = (denom: string) => {
    return (
      userStake?.stakes?.find(stake => stake.denom === denom)?.amount || '0'
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full justify-between mt-3">
      {tokens.map(denom => (
        <div className="bg-background-dialog-bg backdrop-blur-lg p-3 rounded-md w-auto">
          <h3 className="text-h6">
            {STABLECOINS_ASSETS_REGISTRY[denom].symbol}
          </h3>
          <div className="mt-2 pt-3 border-t border-neutral-2">
            <p className="text-base">
              Staked:{' '}
              <span className="text-blue">
                {userStake?.stakes?.find(stake => stake.denom === denom)
                  ?.amount || 0}
              </span>
            </p>
            <p className="text-base mt-2">
              Rewards: <span className="text-blue">0 MLD</span>
            </p>
          </div>
          <div className="flex gap-1 mt-3">
            <Button
              size="sm"
              variant="default-dark"
              onClick={() => handleOpenDialog('stake', denom)}
            >
              Stake
            </Button>
            <Button
              size="sm"
              variant="default-dark"
              onClick={() => handleOpenDialog('unstake', denom)}
              disabled={
                !userStake?.stakes?.find(stake => stake.denom === denom)?.amount
              }
            >
              Unstake
            </Button>
          </div>
        </div>
      ))}

      <StablestakingDialog
        isOpen={dialogState.isOpen}
        onOpenChange={handleCloseDialog}
        action={dialogState.action || 'stake'}
        denom={dialogState.denom}
        stakedAmount={getStakedAmount(dialogState.denom)}
      />
    </div>
  );
};
