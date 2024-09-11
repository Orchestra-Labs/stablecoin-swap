import { useChain } from '@cosmos-kit/react';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { SwapCard } from '@/components/Swap';
import { defaultChainName, IBCPrefix, localAssetRegistry } from '@/constants';
import { useOracleAssets } from '@/hooks';
import {
  Asset,
  ReceiveAssetAtom,
  truncateString,
  useReceiveAmount,
} from '@/sections';

export const ReceiveSwapCard = () => {
  const [receiveAsset, setReceiveAsset] = useAtom(ReceiveAssetAtom);
  const { receiveAmount } = useReceiveAmount();
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

  const onAmountValueChange = (_: number) => {};

  const onAssetValueChange = (denom: string) => {
    const selectedAsset = crossReferencedAssets.find(
      asset => asset.denom === denom,
    );
    if (selectedAsset) {
      setReceiveAsset(selectedAsset);
    }
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
      amountValue={receiveAmount}
      onAssetValueChange={onAssetValueChange}
      onAmountValueChange={onAmountValueChange}
      amountInputEnabled={false}
      address={address ?? ''}
      selectedAsset={receiveAsset || null}
    />
  );
};
