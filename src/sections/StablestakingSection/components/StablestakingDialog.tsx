import { useChain } from '@cosmos-kit/react';
import { useMemo, useState } from 'react';

import { defaultChainName, STABLECOINS_ASSETS_REGISTRY } from '@/constants';
import { useToast, useWalletAssets } from '@/hooks';
import {
  useGetParams,
  useGetUserStakeByDenom,
  useGetUserUnboundingByDenom,
} from '@/sections';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui-kit';

import { useStablecoinStaking } from '../hooks/useStablecoinStaking';
import {
  convertToGreaterUnit,
  formatBalanceDisplay,
  formatDuration,
} from '../utils/common';

type ActionType = 'stake' | 'unstake';

interface StablestakingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  action: ActionType;
  denom: string;
}

const DEFAULT_AMOUNT = 0;

export const StablestakingDialog = ({
  isOpen,
  onOpenChange,
  action,
  denom,
}: StablestakingDialogProps) => {
  const { address } = useChain(defaultChainName);
  const { toast } = useToast();

  const { data } = useGetUserUnboundingByDenom(denom);
  console.log('data', data);
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);

  const selectedAsset = useMemo(() => {
    return STABLECOINS_ASSETS_REGISTRY[denom];
  }, [denom]);

  const { data: stakingParams } = useGetParams();
  const { data: userStake } = useGetUserStakeByDenom(denom);
  const walletAssets = useWalletAssets();

  const { handleStake, handleUnstake, isLoading } = useStablecoinStaking(denom);

  const handleSubmit = async () => {
    if (!address) return;

    const adjustedAmount = (amount * 10 ** selectedAsset.exponent!).toFixed(0);

    if (action === 'stake') {
      await handleStake({
        staker: address,
        amount: {
          amount: adjustedAmount,
          denom: selectedAsset.denom,
        },
      })
        .then(() => {
          toast({
            title: `Stablecoin stake success!`,
            description: `You staked ${amount} ${selectedAsset.symbol}`,
            duration: 5000,
          });
        })
        .catch(err => {
          console.error(err);
          toast({
            title: `Stablecoin stake failed!`,
            description: err ?? 'Something went wrong',
          });
        });
    } else {
      await handleUnstake({
        staker: address,
        amount: {
          amount: adjustedAmount,
          denom: selectedAsset.denom,
        },
      })
        .then(() => {
          toast({
            title: `Stablecoin unstake success!`,
            description: `You unstaked ${amount} ${selectedAsset.symbol}`,
            duration: 5000,
          });
        })
        .catch(err => {
          console.error(err);
          toast({
            title: `Stablecoin unstake failed!`,
            description: err ?? 'Something went wrong',
          });
        });
    }

    setAmount(DEFAULT_AMOUNT);
  };

  const title =
    action === 'stake'
      ? `Stake ${STABLECOINS_ASSETS_REGISTRY[denom]?.symbol}`
      : `Unstake ${STABLECOINS_ASSETS_REGISTRY[denom]?.symbol}`;
  const actionLabel = action === 'stake' ? 'Stake' : 'Unstake';

  const unstakingPeriod = useMemo(() => {
    return formatDuration(stakingParams?.params?.unbonding_duration || '');
  }, [stakingParams]);

  const balance = useMemo(() => {
    if (!walletAssets) return '0';

    return (
      walletAssets.data?.assets.find(asset => asset.denom === denom)?.amount ||
      '0'
    );
  }, [denom, walletAssets]);

  const totalStakedAmount = useMemo(() => {
    if (!selectedAsset) return '';

    if (!userStake?.stakes?.shares) {
      return `0 ${selectedAsset.symbol}`;
    }
    return formatBalanceDisplay(
      convertToGreaterUnit(
        parseFloat(userStake?.stakes?.shares ?? '0'),
        6,
      ).toFixed(6),
      selectedAsset.symbol!,
    );
  }, [selectedAsset, userStake?.stakes?.shares]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center">
          <p className="text-base text-neutral-1 my-1">Staked Balance</p>
          <h2 className="text-h3 text-blue font-bold line-clamp-1">
            {totalStakedAmount}
          </h2>
          <span className="mt-1 text-grey-dark text-base">
            Unstaking period{' '}
            <span className="text-warning">{unstakingPeriod}</span>
          </span>
          <span className="mt-4 text-grey-dark text-base">
            Available balance:{' '}
            <span className="text-blue">
              {balance} {STABLECOINS_ASSETS_REGISTRY[denom]?.symbol}
            </span>
          </span>
        </div>
        <div className="py-4 space-y-4">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium mb-1.5"
            >
              Amount to {action}
            </label>
            <input
              id="amount"
              type="number"
              className="flex h-10 w-full rounded-md border border-neutral-3 bg-transparent px-3 py-2 text-base text-neutral-3 hover:border-neutral-1 hover:text-neutral-1 focus:outline-0 focus:border-blue focus:text-white placeholder:text-sm placeholder:text-neutral-3"
              placeholder={`Enter amount to ${action}`}
            />
          </div>
          <Button
            variant="default"
            className="w-full"
            onClick={handleSubmit}
            disabled={!Number(balance) || isLoading}
          >
            {actionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
