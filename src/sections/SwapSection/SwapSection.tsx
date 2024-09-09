import { useChain } from '@cosmos-kit/react';
import { useAtomValue, useSetAtom } from 'jotai';

import waves2 from '@/assets/images/waves-test.svg';
import { WalletInfoContainer } from '@/components/WalletInfo';
import { defaultChainName } from '@/constants';
import { useSwapTx } from '@/hooks/useSwapTx';
import { useWalletAssets } from '@/hooks/useWalletAssets';
import {
  ErrorMessageAtom,
  ReceiveAssetAtom,
  SendAmountAtom,
  SendAssetAtom,
  WalletAssetsAtom,
} from '@/sections/SwapSection/atoms';
import { ReceiveSwapCard } from '@/sections/SwapSection/ReceiveSwapCard';
import { SendSwapCard } from '@/sections/SwapSection/SendSwapCard';

export const SwapSection = () => {
  const selectedSendAsset = useAtomValue(SendAssetAtom);
  const selectedReceiveAsset = useAtomValue(ReceiveAssetAtom);
  const sendAmount = useAtomValue(SendAmountAtom);
  const errorMessage = useAtomValue(ErrorMessageAtom);
  const setWalletAssets = useSetAtom(WalletAssetsAtom);

  const { data, refetch } = useWalletAssets();
  setWalletAssets(data?.assets ?? []); // Ensure it's always an array

  const { address: sendAddress } = useChain(defaultChainName);

  const { swapTx } = useSwapTx(defaultChainName);

  const performSwap = async () => {
    if (!selectedReceiveAsset || !sendAmount || !selectedSendAsset) {
      alert('Please enter NOTE amount and select both send and receive assets');
      return;
    }

    await swapTx(
      sendAddress!,
      sendAddress!,
      { denom: selectedSendAsset, amount: sendAmount.toFixed(0) },
      selectedReceiveAsset,
    );

    refetch();
  };

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute bg-hero-blur-circle blur-[180px] w-[372px] rounded-full top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 transition-size duration-500"
        style={{ minHeight: '372px' }}
      />
      <div className="flex justify-center items-center min-h-[inherit] relative z-[1] px-25px md:px-6">
        <div
          className="flex flex-col max-w-[882px] text-center items-center gap-4"
          style={{ marginTop: '6rem', marginBottom: '2rem' }}
        >
          <WalletInfoContainer />

          <div className="min-h-[24px]">
            <p className="text-error">{errorMessage}</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8">
            {/* Send Card */}
            <SendSwapCard />

            {/* Swap Button */}
            <div className="flex flex-col items-center justify-center gap-4">
              <button
                className="bg-black py-3 px-6 rounded-lg font-semibold border border-green-700 hover:bg-green-600 transition"
                type="button"
                onClick={performSwap}
              >
                Initiate Swap
              </button>
            </div>

            {/* Receive Card */}
            <ReceiveSwapCard />
          </div>
        </div>
      </div>
      <img
        className="absolute bottom-0 w-full h-[291px]"
        src={waves2}
        alt="Waves"
      />
    </div>
  );
};
