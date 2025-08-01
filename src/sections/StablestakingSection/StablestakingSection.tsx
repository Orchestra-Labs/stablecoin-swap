import { useChain } from '@cosmos-kit/react';
import { LogOut } from 'lucide-react';

import { defaultChainName, walletPrefix } from '@/constants';
import { useToast } from '@/hooks';
import { truncateString } from '@/sections';
import {
  StablecoinList,
  StablecoinsInfo,
  StakersPerPoolPieChart,
} from '@/sections/StablestakingSection/components';
import { TopStakers } from '@/sections/StablestakingSection/components/TopStakers';
import { formatDuration } from '@/sections/StablestakingSection/utils/common';
import { Button } from '@/ui-kit';

import { useGetParams, useGetRewardInfo, useGetTotalStakers } from './hooks';

export const StablestakingSection = () => {
  const { username, address, disconnect } = useChain(defaultChainName);

  const { toast } = useToast();

  const { data: stakingParams } = useGetParams();
  const { data: rewardInfo } = useGetRewardInfo();
  const { data: totalStakers } = useGetTotalStakers();

  console.log('Test endpoints', rewardInfo);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);

    toast({
      title: `Copied to clipboard!`,
      description: `Address ${truncateString(walletPrefix, text)} has been copied.`,
    });
  };

  const unboundingPeriod = formatDuration(
    stakingParams?.params?.unbonding_duration || '0',
  );

  const totalStakersAmount = totalStakers?.stakers?.reduce(
    (accum, item) => accum + Number(item.count),
    0,
  );

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute bg-hero-blur-circle blur-[180px] w-[372px] rounded-full top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 transition-size duration-500"
        style={{ minHeight: '372px' }}
      />
      <div className="pt-[128px] px-6 flex items-center justify-center">
        <div className="bg-black max-w-[882px] w-full p-6 rounded-lg backdrop-blur-lg">
          <h2 className="">Wallet Info</h2>
          <div className="flex flex-col items-center mt-3 bg-background-dialog-bg backdrop-blur-lg p-3 rounded-md w-full">
            <p className="text-base text-center">
              Wallet: <span className="text-blue text-lg">{username}</span>
            </p>
            <p className="inline-flex justify-center items-center text-base text-center mt-2">
              Address:{' '}
              <span
                className="block sm:hidden text-sm text-muted-foreground hover:bg-blue-hover hover:cursor-pointer py-1 px-2 rounded-md"
                onClick={() => copyToClipboard((address || '').toString())}
              >
                {truncateString(walletPrefix, address || '')}
              </span>
              <span
                className="hidden sm:block text-sm text-muted-foreground hover:bg-blue-hover hover:cursor-pointer py-1 px-2 rounded-md"
                onClick={() => copyToClipboard((address || '').toString())}
              >
                {address}
              </span>
            </p>
            <Button
              className="mx-auto mt-4 bg-error hover:bg-error/80 hover:text-black"
              size="sm"
              onClick={() => disconnect()}
            >
              <LogOut className="inline-block size-4" />
              Disconnect
            </Button>
          </div>

          <h2 className="mt-6">Your Staking</h2>
          <StablecoinList />
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full justify-between">
            <div className="bg-background-dialog-bg backdrop-blur-lg p-3 rounded-md w-full">
              <h3 className="text-base">Total Staked</h3>
              <p className="text-h6 mt-2">N/A</p>
            </div>
            <div className="bg-background-dialog-bg backdrop-blur-lg p-3 rounded-md w-full">
              <h3 className="text-base">Rewards</h3>
              <p className="text-h6 mt-2">N/A</p>
            </div>
            <div className="bg-background-dialog-bg backdrop-blur-lg p-3 rounded-md w-full">
              <h3 className="text-base">Unbounding period</h3>
              <p className="text-h6 mt-2">{unboundingPeriod}</p>
            </div>
            <div className="bg-background-dialog-bg backdrop-blur-lg p-3 rounded-md w-full">
              <h3 className="text-base">Total Stakers</h3>
              <p className="text-h6 mt-2">{totalStakersAmount}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background-dialog-bg backdrop-blur-lg p-3 rounded-md w-full">
              <TopStakers />
            </div>
            <div className="flex flex-col">
              <div className="bg-background-dialog-bg backdrop-blur-lg p-3 rounded-md w-full">
                <h3 className="text-h6">Stakers By Pool</h3>
                <div className="border-t border-neutral-2 my-3" />
                <StakersPerPoolPieChart />
              </div>
              <div className="mt-4 bg-background-dialog-bg backdrop-blur-lg p-3 rounded-md w-full">
                <StablecoinsInfo />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
