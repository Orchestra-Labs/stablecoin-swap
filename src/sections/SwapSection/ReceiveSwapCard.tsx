import { useChain } from '@cosmos-kit/react';
import { useAtom, useAtomValue } from 'jotai';
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
import { SendAmountAtom, SendAssetAtom, WalletAssetsAtom } from './atoms';

export const ReceiveSwapCard = () => {
  const [receiveAsset, setReceiveAsset] = useAtom(ReceiveAssetAtom);
  const [receiveAmount, setReceiveAmount] = useAtom(ReceiveAmountAtom);
  const [isReceiveUpdate, setIsReceiveUpdate] = useState(false); // Track Receive updates

  const [sendAmount, setSendAmount] = useAtom(SendAmountAtom);
  const sendAsset = useAtomValue(SendAssetAtom);
  const walletAssets = useAtomValue(WalletAssetsAtom);
  const { exchangeRate } = useExchangeRate(); // Use exchange rate hook

  const { assets } = useOracleAssets();
  const { address } = useChain(defaultChainName);

  const [crossReferencedAssets, setCrossReferencedAssets] = useState<Asset[]>(
    [],
  );

  // Recalculate crossReferencedAssets when assets change
  useEffect(() => {
    const mergedAssets = [...assets, ...Object.values(localAssetRegistry)];
    const updatedAssets = mergedAssets.map(asset => ({
      ...asset,
      symbol: asset.symbol || asset.denom,
    }));
    setCrossReferencedAssets(updatedAssets);
  }, [assets]);

  // Handle change in receive amount
  const onAmountValueChange = (value: number) => {
    setIsReceiveUpdate(true);
    setReceiveAmount(value);
  };

  // Handle change in receive asset
  const onAssetValueChange = (denom: string) => {
    const selectedAsset = crossReferencedAssets.find(
      asset => asset.denom === denom,
    );

    if (selectedAsset) {
      setReceiveAsset(selectedAsset);
    }
  };

  // UseEffect to recalculate the receive amount based on the updated receive asset and exchange rate
  useEffect(() => {
    if (receiveAsset && exchangeRate && sendAsset) {
      if (receiveAsset.denom === sendAsset.denom) {
        setReceiveAmount(sendAmount);
      } else {
        let newReceiveAmount = sendAmount * exchangeRate;

        const exponent = receiveAsset.exponent || 6;
        newReceiveAmount = parseFloat(newReceiveAmount.toFixed(exponent));

        setReceiveAmount(newReceiveAmount);
      }
    }
  }, [receiveAsset, exchangeRate, sendAsset, sendAmount]);

  // Recalculate send amount when receive amount is updated, but not when the receive asset changes
  useEffect(() => {
    if (isReceiveUpdate && sendAsset) {
      const amount = parseFloat(sendAsset?.amount || '0'); // Ensure `sendAsset.amount` is a number
      const exponent = sendAsset?.exponent || 6;
      const maxAvailable = amount / 10 ** exponent;

      if (receiveAmount === 0) {
        setSendAmount(0); // Set send amount to 0 if receive is 0
      } else if (exchangeRate) {
        const newSendAmount = receiveAmount / exchangeRate;

        if (newSendAmount > maxAvailable) {
          setSendAmount(maxAvailable); // Cap send amount to max available
          setReceiveAmount(maxAvailable * exchangeRate); // Recompute receive amount
        } else {
          setSendAmount(newSendAmount); // Update send amount
        }
      }
      setIsReceiveUpdate(false); // Reset flag after update
    }
  }, [receiveAmount, exchangeRate, sendAsset, walletAssets]);

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
