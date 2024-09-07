import { useChain } from '@cosmos-kit/react';
import { useSetAtom } from 'jotai';

import { SwapCard } from '@/components/Swap';
import { defaultChainName } from '@/constants';
import { useOracleAssets } from '@/hooks';
import { useReceiveAmount } from '@/sections';
import { ReceiveAssetAtom } from '@/sections/SwapSection/atoms';

export const ReceiveSwapCard = () => {
  const setReceiveAsset = useSetAtom(ReceiveAssetAtom);
  const { receiveAmount } = useReceiveAmount();
  const { assets } = useOracleAssets();

  const { address } = useChain(defaultChainName);

  const onAmountValueChange = (_: number) => {};

  const onAssetValueChange = (value: string) => {
    setReceiveAsset(value || '');
  };

  return (
    <SwapCard
      title="Receive"
      selectPlaceholder="Select asset to receive"
      options={Object.assign({}, ...assets.map(x => ({ [x.denom]: x.denom })))}
      amountValue={receiveAmount}
      onAssetValueChange={onAssetValueChange}
      onAmountValueChange={onAmountValueChange}
      amountInputEnabled={false}
      address={address ?? ''}
    />
  );
};
