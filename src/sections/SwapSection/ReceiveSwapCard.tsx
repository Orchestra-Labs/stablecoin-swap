import { useChain } from '@cosmos-kit/react';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { SwapCard } from '@/components/Swap';
import {
  defaultChainName,
  greaterExponentDefault,
  IBCPrefix,
  localAssetRegistry,
} from '@/constants';
import { useOracleAssets } from '@/hooks';
import { Asset, truncateString } from '@/sections';
import { ReceiveAddressAtom, ReceiveStateAtom } from './atoms';

export const ReceiveSwapCard = ({
  updateReceiveAsset,
  updateReceiveAmount,
}: {
  updateReceiveAsset: (newAsset: Asset, propagateChanges?: boolean) => void;
  updateReceiveAmount: (
    newReceiveAmount: number,
    propagateChanges?: boolean,
  ) => void;
}) => {
  const receiveState = useAtomValue(ReceiveStateAtom);
  const { assets } = useOracleAssets();
  const initialAddress = useChain(defaultChainName);
  const [address, setAddress] = useAtom(ReceiveAddressAtom);

  const [crossReferencedAssets, setCrossReferencedAssets] = useState<Asset[]>(
    [],
  );

  useEffect(() => {
    setAddress(initialAddress.address || '');
  }, []);

  // Recalculate crossReferencedAssets when assets change
  useEffect(() => {
    const mergedAssets = [...assets, ...Object.values(localAssetRegistry)];
    const updatedAssets = mergedAssets.map(asset => ({
      ...asset,
      symbol:
        asset.symbol ||
        `H${asset.denom.startsWith('u') ? asset.denom.slice(1) : asset.denom}`.toUpperCase(),
    }));
    setCrossReferencedAssets(updatedAssets);
  }, [assets]);

  // Handle change in receive amount
  const onAmountValueChange = (value: number) => {
    const exponent = receiveState.asset?.exponent ?? greaterExponentDefault;
    const roundedValue = parseFloat(value.toFixed(exponent));
    updateReceiveAmount(roundedValue, true); // Propagate the change
  };

  // Handle change in receive asset
  const onAssetValueChange = (denom: string) => {
    const selectedAsset = crossReferencedAssets.find(
      asset => asset.denom === denom,
    );
    if (selectedAsset) {
      updateReceiveAsset(selectedAsset, true); // Propagate the change
    }
  };

  const onAddressChange = (newAddress: string) => {
    setAddress(newAddress);
  };

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
      amountValue={receiveState.amount}
      onAssetValueChange={onAssetValueChange}
      onAmountValueChange={onAmountValueChange}
      amountInputEnabled={true}
      address={address ?? ''}
      onAddressChange={onAddressChange}
      selectedAsset={receiveState.asset || null}
    />
  );
};
