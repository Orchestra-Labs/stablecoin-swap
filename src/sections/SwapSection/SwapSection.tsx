import { useChain } from '@cosmos-kit/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import waves2 from '@/assets/images/waves-test.svg';
import { WalletInfoContainer } from '@/components/WalletInfo';
import { defaultChainName, greaterExponentDefault } from '@/constants';
import { useSwapTx } from '@/hooks/useSwapTx';
import { useWalletAssets } from '@/hooks/useWalletAssets';
import {
  ErrorMessageAtom,
  LoadingAtom,
  SendStateAtom,
  ReceiveStateAtom,
  WalletAssetsAtom,
  ChangeMapAtom,
} from '@/sections/SwapSection/atoms';
import { ReceiveSwapCard } from '@/sections/SwapSection/ReceiveSwapCard';
import { SendSwapCard } from '@/sections/SwapSection/SendSwapCard';
import { Loader } from '@/components';
import { useEffect } from 'react';
import { Asset } from './types';
import { useExchangeRate } from '@/hooks';

export const SwapSection = () => {
  const [sendState, setSendState] = useAtom(SendStateAtom);
  const [receiveState, setReceiveState] = useAtom(ReceiveStateAtom);
  const [changeMap, setChangeMap] = useAtom(ChangeMapAtom);
  const { exchangeRate } = useExchangeRate();

  const errorMessage = useAtomValue(ErrorMessageAtom);
  const setWalletAssets = useSetAtom(WalletAssetsAtom);
  const [isLoading, setLoading] = useAtom(LoadingAtom);

  const { data, refetch } = useWalletAssets();
  const { address: sendAddress } = useChain(defaultChainName);
  const { swapTx } = useSwapTx(defaultChainName);

  useEffect(() => {
    setWalletAssets(data?.assets ?? []);
  }, [data]);

  const performSwap = async () => {
    if (!receiveState.asset || !sendState.amount || !sendState.asset) {
      alert('Please enter NOTE amount and select both send and receive assets');
      return;
    }

    setLoading(true);
    const sendAmountMicroUnit =
      sendState.amount *
      10 ** (sendState.asset.exponent ?? greaterExponentDefault);

    await swapTx(
      sendAddress!,
      sendAddress!,
      {
        denom: sendState.asset.denom,
        amount: sendAmountMicroUnit.toString(),
      },
      receiveState.asset.denom,
    );
    refetch();
    setLoading(false);
  };

  const calculateMaxAvailable = (asset: Asset) => {
    const amount = parseFloat(asset?.amount ?? '0');
    const exponent = asset?.exponent ?? greaterExponentDefault;
    const maxAvailable = amount / 10 ** exponent;

    return maxAvailable;
  };

  const updateSendAsset = (
    newAsset: Asset,
    propagateChanges: boolean = false,
  ) => {
    setSendState(prevState => ({
      ...prevState,
      asset: {
        ...newAsset,
      },
    }));

    if (propagateChanges) {
      setChangeMap(prevMap => ({ ...prevMap, sendAsset: true }));
    }
  };

  const updateReceiveAsset = (newAsset: Asset, propagate: boolean = false) => {
    setReceiveState(prevState => ({
      ...prevState,
      asset: {
        ...newAsset,
      },
    }));

    if (propagate) {
      setChangeMap(prevMap => ({
        ...prevMap,
        receiveAsset: true,
      }));
    }
  };

  const updateSendAmount = (
    newSendAmount: number,
    propagateChanges: boolean = false,
  ) => {
    const sendAsset = sendState.asset;
    if (!sendAsset) return;

    const exponent = sendAsset.exponent ?? greaterExponentDefault;
    const roundedSendAmount = parseFloat(newSendAmount.toFixed(exponent));

    setSendState(prevState => ({
      ...prevState,
      amount: roundedSendAmount,
    }));

    if (propagateChanges) {
      setChangeMap(prevMap => ({
        ...prevMap,
        sendAmount: true,
      }));
    }
  };

  const updateReceiveAmount = (
    newReceiveAmount: number,
    propagateChanges: boolean = false,
  ) => {
    const receiveAsset = receiveState.asset;
    if (!receiveAsset) return;

    const exponent = receiveAsset.exponent ?? greaterExponentDefault;
    const roundedReceiveAmount = parseFloat(newReceiveAmount.toFixed(exponent));

    setReceiveState(prevState => ({
      ...prevState,
      amount: roundedReceiveAmount,
    }));

    if (propagateChanges) {
      setChangeMap(prevMap => ({
        ...prevMap,
        receiveAmount: true,
      }));
    }
  };

  const propagateChanges = () => {
    if (changeMap.sendAsset) {
      const sendAsset = sendState.asset;
      const sendAmount = sendState.amount;
      // Required since sendAsset is nullable
      if (sendAsset == null) {
        return;
      }

      const maxAvailable = calculateMaxAvailable(sendAsset);
      if (sendAmount > maxAvailable) {
        // Reset sendAmount to maxAvailable
        const newSendAmount = maxAvailable;
        const newReceiveAmount = newSendAmount * (exchangeRate || 1);

        updateSendAmount(newSendAmount);
        updateReceiveAmount(newReceiveAmount);
      } else {
        // If sendAmount is valid, update receiveAmount
        const newReceiveAmount = sendState.amount * (exchangeRate || 1);
        updateReceiveAmount(newReceiveAmount);
      }

      // Reset the flag
      setChangeMap(prevMap => ({ ...prevMap, sendAsset: false }));
    }

    if (changeMap.receiveAsset) {
      const sendAmount = sendState.amount;
      const newReceiveAmount = sendAmount * (exchangeRate || 1);

      updateReceiveAmount(newReceiveAmount);

      // Reset the flag
      setChangeMap(prevMap => ({ ...prevMap, receiveAsset: false }));
    }

    if (changeMap.sendAmount) {
      const sendAsset = sendState.asset;
      if (!sendAsset) return;

      const sendAmount = sendState.amount;
      const maxAvailable = calculateMaxAvailable(sendAsset);
      let verifiedSendAmount =
        sendAmount > maxAvailable ? maxAvailable : sendAmount;

      // Update sendAmount if it exceeds maxAvailable
      if (sendAmount > maxAvailable) {
        updateSendAmount(maxAvailable);
        verifiedSendAmount = maxAvailable;
      }

      // Check if the send asset is the same as the receive asset
      let applicableExchangeRate =
        sendAsset.denom === receiveState.asset?.denom ? 1 : exchangeRate || 1;

      const newReceiveAmount = verifiedSendAmount * applicableExchangeRate;
      updateReceiveAmount(newReceiveAmount);

      // Reset the flag
      setChangeMap(prevMap => ({ ...prevMap, sendAmount: false }));
    }

    if (changeMap.receiveAmount) {
      const sendAsset = sendState.asset;
      if (!sendAsset) return;

      const receiveAmount = receiveState.amount;
      // If send and receive assets are the same, set sendAmount to receiveAmount
      // Otherwise, calculate the sendAmount using 1/exchangeRate
      let applicableExchangeRate =
        sendAsset.denom === receiveState.asset?.denom
          ? 1
          : 1 / (exchangeRate || 1);
      let newSendAmount = receiveAmount * applicableExchangeRate;

      const maxAvailable = calculateMaxAvailable(sendAsset);
      if (newSendAmount > maxAvailable) {
        newSendAmount = maxAvailable;
        const adjustedReceiveAmount = newSendAmount * (exchangeRate || 1);

        updateSendAmount(newSendAmount);
        updateReceiveAmount(adjustedReceiveAmount);
      } else {
        updateSendAmount(newSendAmount);
      }

      // Reset the flag
      setChangeMap(prevMap => ({ ...prevMap, receiveAmount: false }));
    }
  };

  useEffect(() => {
    propagateChanges();
  }, [changeMap]);

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
          <WalletInfoContainer updateSendAsset={updateSendAsset} />

          <div className="min-h-[24px]">
            <p className="text-error">{errorMessage}</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8">
            {/* Send Card */}
            <SendSwapCard
              updateSendAsset={updateSendAsset}
              updateSendAmount={updateSendAmount}
            />

            {/* Swap Button */}
            <div className="flex flex-col items-center justify-center gap-4">
              <button
                className="relative bg-black py-3 px-6 rounded-lg font-semibold border border-green-700 hover:bg-green-600 transition"
                type="button"
                onClick={performSwap}
                disabled={isLoading}
              >
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader backgroundClass="inherit" />
                  </div>
                )}
                <span className={`${isLoading ? 'opacity-0' : ''}`}>
                  Initiate Swap
                </span>
              </button>
            </div>

            {/* Receive Card */}
            <ReceiveSwapCard
              updateReceiveAsset={updateReceiveAsset}
              updateReceiveAmount={updateReceiveAmount}
            />
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
