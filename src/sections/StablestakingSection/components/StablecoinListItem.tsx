import { FC, useMemo } from 'react';

import { STABLECOINS_ASSETS_REGISTRY } from '@/constants';
import { useGetUserStakeByDenom } from '@/sections/StablestakingSection/hooks/useGetUserStakeByDenom';
import { Button } from '@/ui-kit';

import { convertToGreaterUnit, formatBalanceDisplay } from '../utils/common';

type StablecoinListItemProps = {
  denom: string;
  handleOpenDialog: (action: 'stake' | 'unstake', denom: string) => void;
};

export const StablecoinListItem: FC<StablecoinListItemProps> = ({
  denom,
  handleOpenDialog,
}) => {
  const { data: userStake } = useGetUserStakeByDenom(denom);

  const asset = STABLECOINS_ASSETS_REGISTRY[denom];

  const totalStakedAmount = useMemo(() => {
    if (!userStake?.stakes?.shares) {
      return `0 ${asset.symbol}`;
    }
    return formatBalanceDisplay(
      convertToGreaterUnit(
        parseFloat(userStake?.stakes?.shares ?? '0'),
        6,
      ).toFixed(6),
      asset.symbol!,
    );
  }, [asset.symbol, userStake?.stakes?.shares]);

  const isDisabled = !Number(userStake?.stakes?.shares);

  return (
    <div className="bg-background-dialog-bg backdrop-blur-lg p-3 rounded-md w-auto">
      <h3 className="text-h6">{STABLECOINS_ASSETS_REGISTRY[denom].symbol}</h3>
      <div className="mt-2 pt-3 border-t border-neutral-2">
        <p className="text-base">
          Staked: <span className="text-blue">{totalStakedAmount}</span>
        </p>
        <p className="text-base mt-2">
          Rewards: <span className="text-blue">0 MLD</span>
        </p>
        <p className="text-base mt-2">
          APR: <span className="text-blue">0 %</span>
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
          disabled={isDisabled}
        >
          Unstake
        </Button>
      </div>
    </div>
  );
};
