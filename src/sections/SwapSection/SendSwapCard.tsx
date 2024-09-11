import { useChain } from '@cosmos-kit/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { SwapCard } from '@/components/Swap';
import { defaultChainName, IBCPrefix } from '@/constants';
import { SendAmountAtom, SendAssetAtom, WalletAssetsAtom } from './atoms';
import { truncateString } from './utils';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { ReceiveAmountAtom, ReceiveAssetAtom } from '@/sections';

export const SendSwapCard = () => {
  const [sendAsset, setSendAsset] = useAtom(SendAssetAtom);
  const [sendAmount, setSendAmount] = useAtom(SendAmountAtom);
  const [isSendUpdate, setIsSendUpdate] = useState(false); // Track Send updates

  const setReceiveAmount = useSetAtom(ReceiveAmountAtom);
  const receiveAsset = useAtomValue(ReceiveAssetAtom);
  const { exchangeRate } = useExchangeRate(); // Use exchange rate hook

  const walletAssets = useAtomValue(WalletAssetsAtom);
  const { address } = useChain(defaultChainName);

  const onAmountValueChange = (value: number) => {
    setIsSendUpdate(true);
    setSendAmount(value ?? 0);
  };

  const onAssetValueChange = (denom: string) => {
    const asset = walletAssets.find(asset => asset.denom === denom);
    if (asset) {
      setIsSendUpdate(true);
      setSendAsset(asset);
    }
  };

  useEffect(() => {
    if (isSendUpdate) {
      if (sendAmount === 0) {
        setReceiveAmount(0); // If send amount is 0, set receive amount to 0
      } else if (exchangeRate && sendAmount && receiveAsset) {
        const newReceiveAmount = sendAmount * exchangeRate;
        setReceiveAmount(newReceiveAmount);
      }
      setIsSendUpdate(false); // Reset flag after the update
    }
  }, [sendAmount, sendAsset, exchangeRate, receiveAsset]);

  return (
    <SwapCard
      title="Send"
      selectPlaceholder="Select asset to send"
      options={walletAssets.reduce(
        (acc, asset) => {
          acc[asset.denom] = {
            value: asset.denom,
            label: truncateString(
              IBCPrefix,
              asset.symbol ? asset.symbol : asset.denom,
            ),
            logo: asset.logo,
          };
          return acc;
        },
        {} as {
          [key: string]: { value: string; label: string; logo?: string };
        },
      )}
      amountValue={sendAmount}
      selectedAsset={sendAsset || null}
      onAssetValueChange={onAssetValueChange}
      onAmountValueChange={onAmountValueChange}
      address={address ?? ''}
      addressInputEnabled={false}
    />
  );
};
