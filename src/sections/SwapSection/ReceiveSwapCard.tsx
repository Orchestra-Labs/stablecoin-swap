import { useChain } from '@cosmos-kit/react';
import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { SwapCard } from '@/components/Swap';
import { defaultChainName, IBCPrefix, localAssetRegistry } from '@/constants';
import { useOracleAssets } from '@/hooks';
import {
  Asset,
  ReceiveAssetAtom,
  truncateString,
  ReceiveAmountAtom,
} from '@/sections';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import { SendAmountAtom, SendAssetAtom } from './atoms';

export const ReceiveSwapCard = () => {
  const [receiveAsset, setReceiveAsset] = useAtom(ReceiveAssetAtom);
  const [receiveAmount, setReceiveAmount] = useAtom(ReceiveAmountAtom);
  const [isReceiveUpdate, setIsReceiveUpdate] = useState(false); // Track Receive updates

  const setSendAmount = useSetAtom(SendAmountAtom);
  const sendAsset = useAtom(SendAssetAtom);
  const { exchangeRate } = useExchangeRate(); // Use exchange rate hook

  const { assets } = useOracleAssets();
  const { address } = useChain(defaultChainName);

  const [crossReferencedAssets, setCrossReferencedAssets] = useState<Asset[]>(
    [],
  );

  // Recalculate crossReferencedAssets when assets change
  useEffect(() => {
    const mergedAssets = [...assets, ...Object.values(localAssetRegistry)];

    const updatedAssets = mergedAssets.map(asset => {
      return {
        ...asset,
        symbol: asset.symbol || asset.denom,
      };
    });

    setCrossReferencedAssets(updatedAssets);
  }, [assets]);

  const onAmountValueChange = (value: number) => {
    setIsReceiveUpdate(true);
    setReceiveAmount(value);
  };

  const onAssetValueChange = (denom: string) => {
    const selectedAsset = crossReferencedAssets.find(
      asset => asset.denom === denom,
    );
    if (selectedAsset) {
      setIsReceiveUpdate(true);
      setReceiveAsset(selectedAsset);
    }
  };

  useEffect(() => {
    if (isReceiveUpdate) {
      if (receiveAmount === 0) {
        setSendAmount(0); // If receive amount is 0, set send amount to 0
      } else if (exchangeRate && receiveAmount && sendAsset) {
        const newSendAmount = Math.ceil(receiveAmount *1000000 / exchangeRate)/1000000;
        setSendAmount(newSendAmount);
      }
      setIsReceiveUpdate(false); // Reset flag after the update
    }
  }, [receiveAmount, receiveAsset, exchangeRate, sendAsset]);

  return (
    <SwapCard
      title="Receive"
      selectPlaceholder="Select asset to receive"
      options={crossReferencedAssets.reduce(
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
      amountValue={receiveAmount}
      onAssetValueChange={onAssetValueChange}
      onAmountValueChange={onAmountValueChange}
      amountInputEnabled={false}
      address={address ?? ''}
      selectedAsset={receiveAsset || null}
    />
  );
};
