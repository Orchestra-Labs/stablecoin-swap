import { useChain } from '@cosmos-kit/react';
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { SwapCard } from '@/components/Swap';
import { defaultChainName, IBCPrefix } from '@/constants';
import { useOracleAssets } from '@/hooks';
import {
  Asset,
  ReceiveAssetAtom,
  truncateString,
  useReceiveAmount,
} from '@/sections';

// Define the constant assets, including MLD and HUSD
const additionalAssets: Asset[] = [
  {
    denom: 'ukhd',
    amount: '0',
    isIbc: false,
    logo: '',
    symbol: 'HHKD', // Updated symbol for ukhd
    exponent: 6,
  },
  {
    denom: 'uvnd',
    amount: '0',
    isIbc: false,
    logo: '',
    symbol: 'HVND', // Updated symbol for uvnd
    exponent: 6,
  },
  {
    denom: 'note',
    amount: '0',
    isIbc: false,
    logo: '',
    symbol: 'MLD', // Updated symbol for note
    exponent: 6,
  },
  {
    denom: 'uusd',
    amount: '0',
    isIbc: false,
    logo: '',
    symbol: 'HUSD', // Updated symbol for uusd
    exponent: 6,
  },
];

export const ReceiveSwapCard = () => {
  const setReceiveAsset = useSetAtom(ReceiveAssetAtom);
  const { receiveAmount } = useReceiveAmount();
  const { assets } = useOracleAssets(); // Oracle assets from API or source
  const { address } = useChain(defaultChainName); // Chain connection address

  const [crossReferencedAssets, setCrossReferencedAssets] = useState<Asset[]>(
    [],
  );

  // Recalculate crossReferencedAssets when assets change
  useEffect(() => {
    // Merge the constant assets (additionalAssets) with the Oracle assets
    const mergedAssets = [...assets, ...additionalAssets];

    const updatedAssets = mergedAssets.map(asset => {
      // Merge with the symbol or use the default asset symbol or denom
      return {
        ...asset,
        symbol: asset.symbol || asset.denom,
      };
    });

    setCrossReferencedAssets(updatedAssets);
  }, [assets]);

  console.log('crossReferencedAssets:', crossReferencedAssets);

  const onAmountValueChange = (_: number) => {};

  const onAssetValueChange = (value: string) => {
    setReceiveAsset(value || '');
  };

  return (
    <SwapCard
      title="Receive"
      selectPlaceholder="Select asset to receive"
      options={Object.assign(
        {},
        ...crossReferencedAssets.map(x => ({
          [x.denom]: truncateString(IBCPrefix, x.symbol ? x.symbol : x.denom),
        })),
      )}
      amountValue={receiveAmount}
      onAssetValueChange={onAssetValueChange}
      onAmountValueChange={onAmountValueChange}
      amountInputEnabled={false}
      address={address ?? ''}
    />
  );
};
