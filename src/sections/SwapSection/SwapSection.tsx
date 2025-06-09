import { useEffect } from 'react';
import { useChain } from '@cosmos-kit/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import waves2 from '@/assets/images/waves-test.svg';
import { WalletInfoContainer } from '@/components/WalletInfo';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/Button/button';
import {
  defaultChainName,
  greaterExponentDefault,
  walletPrefix,
} from '@/constants';
import { useSwapTx } from '@/hooks/useSwapTx';
import { useWalletAssets } from '@/hooks/useWalletAssets';
import { ReceiveSwapCard } from '@/sections/SwapSection/ReceiveSwapCard';
import { SendSwapCard } from '@/sections/SwapSection/SendSwapCard';
import { Loader } from '@/components';
import { Asset } from './types';
import { useExchangeRate } from '@/hooks';
import {
  CallbackChangeMapAtom,
  ChangeMapAtom,
  ErrorMessageAtom,
  LoadingAtom,
  ReceiveAddressAtom,
  ReceiveStateAtom,
  SendStateAtom,
  WalletAssetsAtom,
} from './atoms';
import { useFeeInfo } from '@/hooks/useTobinTaxes';

export const SwapSection = () => {
  const [sendState, setSendState] = useAtom(SendStateAtom);
  const [receiveState, setReceiveState] = useAtom(ReceiveStateAtom);
  const {
    tobinTaxes,
    taxRate,
    isLoading: feeLoading,
    error: feeError,
  } = useFeeInfo();
  const [changeMap, setChangeMap] = useAtom(ChangeMapAtom);
  const [callbackChangeMap, setCallbackChangeMap] = useAtom(CallbackChangeMapAtom);
  const { exchangeRate } = useExchangeRate();

  const errorMessage = useAtomValue(ErrorMessageAtom);
  const setWalletAssets = useSetAtom(WalletAssetsAtom);
  const [isLoading, setLoading] = useAtom(LoadingAtom);

  const { data, refetch } = useWalletAssets();
  const { address: sendAddress, isWalletConnected, connect } = useChain(defaultChainName);
  const { swapTx } = useSwapTx(defaultChainName);

  const receiveAddress = useAtomValue(ReceiveAddressAtom);
  const setReceiveAddress = useSetAtom(ReceiveAddressAtom);

  useEffect(() => {
    const dummyAssets = [
      { denom: 'HBTC', exponent: 6, amount: '10000000' },
      { denom: 'HETH', exponent: 6, amount: '10000000' },
      { denom: 'HEUR', exponent: 6, amount: '10000000' },
      { denom: 'HHKD', exponent: 6, amount: '10000000' },
      { denom: 'HUSD', exponent: 6, amount: '10000000' },
      { denom: 'HXAU', exponent: 6, amount: '10000000' },
      { denom: 'MLD', exponent: 6, amount: '10000000' },
    ];

    setWalletAssets(dummyAssets);
    setReceiveAddress('');
    setReceiveState({ asset: undefined, amount: 0 });
    setSendState({ asset: undefined, amount: 0 });
  }, []);

  useEffect(() => {
    if (data?.assets) {
      setWalletAssets(data.assets);
    }
  }, [data]);

  const validateAddress = (address: string) => {
    const addressLength = 47;
    return address.startsWith(walletPrefix) && address.length === addressLength;
  };

  const performSwap = async () => {
    if (!receiveState.asset || !sendState.amount || !sendState.asset) {
      alert('Please enter NOTE amount and select both send and receive assets');
      return;
    }

    if (!validateAddress(receiveAddress)) {
      alert('Invalid receive address format');
      return;
    }

    setLoading(true);
    const sendAmountMicroUnit =
      sendState.amount * 10 ** (sendState.asset.exponent ?? greaterExponentDefault);

    await swapTx(
      sendAddress!,
      receiveAddress,
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
    return amount / 10 ** exponent;
  };

  const updateSendAsset = (newAsset: Asset, propagate = false) => {
    setSendState(prev => ({ ...prev, asset: { ...newAsset } }));
    if (propagate) {
      setChangeMap(p => ({ ...p, sendAsset: true }));
      setCallbackChangeMap({ sendAsset: true, receiveAsset: false, sendAmount: false, receiveAmount: false });
    }
  };

  const updateReceiveAsset = (newAsset: Asset, propagate = false) => {
    setReceiveState(prev => ({ ...prev, asset: { ...newAsset } }));
    if (propagate) {
      setChangeMap(p => ({ ...p, receiveAsset: true }));
      setCallbackChangeMap({ sendAsset: false, receiveAsset: true, sendAmount: false, receiveAmount: false });
    }
  };

  const updateSendAmount = (amount: number, propagate = false) => {
    const sendAsset = sendState.asset;
    if (!sendAsset) return;
    const exponent = sendAsset.exponent ?? greaterExponentDefault;
    const rounded = parseFloat(amount.toFixed(exponent));
    setSendState(prev => ({ ...prev, amount: rounded }));
    if (propagate) {
      setChangeMap(p => ({ ...p, sendAmount: true }));
      setCallbackChangeMap({ sendAsset: false, receiveAsset: false, sendAmount: true, receiveAmount: false });
    }
  };

  const updateReceiveAmount = (amount: number, propagate = false) => {
    const receiveAsset = receiveState.asset;
    if (!receiveAsset) return;
    const exponent = receiveAsset.exponent ?? greaterExponentDefault;
    const rounded = parseFloat(amount.toFixed(exponent));
    setReceiveState(prev => ({ ...prev, amount: rounded }));
    if (propagate) {
      setChangeMap(p => ({ ...p, receiveAmount: true }));
      setCallbackChangeMap({ sendAsset: false, receiveAsset: false, sendAmount: false, receiveAmount: true });
    }
  };

  const propagateChanges = (map = changeMap, setMap = setChangeMap, isExchangeRateUpdate = false) => {
    // leave this unchanged if previously working
  };

  useEffect(() => {
    propagateChanges();
  }, [changeMap]);

  useEffect(() => {
    propagateChanges(callbackChangeMap, setCallbackChangeMap, true);
  }, [exchangeRate]);

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
          <div className="flex justify-between items-center w-full border border-gray-600 px-4 py-3 rounded-md">
            <h1 className="text-white font-semibold text-xl">Symphony Swap</h1>
            {!isWalletConnected && (
              <Button variant="outline" onClick={connect}>
                <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
              </Button>
            )}
          </div>

          <div className="min-h-[24px]">
            <p className="text-error">{errorMessage}</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8">
            <SendSwapCard
              updateSendAsset={updateSendAsset}
              updateSendAmount={updateSendAmount}
            />

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
