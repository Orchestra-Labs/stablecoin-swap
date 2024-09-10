import { useChain } from '@cosmos-kit/react';
import { useSetAtom } from 'jotai';
import { SwapCard } from '@/components/Swap';
import { defaultChainName } from '@/constants';
import { useOracleAssets } from '@/hooks';
import { useReceiveAmount } from '@/sections';
import { ReceiveAssetAtom, LoadingAtom } from '@/sections/SwapSection/atoms';
import { useEffect } from 'react';

export const ReceiveSwapCard = () => {
  const setReceiveAsset = useSetAtom(ReceiveAssetAtom);
  const { receiveAmount } = useReceiveAmount();
  const { assets } = useOracleAssets();
  const setLoading = useSetAtom(LoadingAtom);

  const { address } = useChain(defaultChainName);

  useEffect(() => {
    setLoading(!assets.length);
  }, [assets, setLoading]);

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
