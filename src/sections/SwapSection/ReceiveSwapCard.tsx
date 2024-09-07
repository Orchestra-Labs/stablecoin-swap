import { useAtom } from 'jotai/react/useAtom';
import { useSetAtom } from 'jotai/react/useSetAtom';

import { SwapCard } from '@/components/Swap';
import { useOracleAssets } from '@/hooks';
import { ReceiveAmountAtom } from '@/sections/SwapSection/atoms/ReceiveAmountAtom';
import { ReceiveAssetAtom } from '@/sections/SwapSection/atoms/ReceiveAssetAtom';

export const ReceiveSwapCard = () => {
  const setReceiveAsset = useSetAtom(ReceiveAssetAtom);
  const [receiveAmount, setReceiveAmount] = useAtom(ReceiveAmountAtom);
  const { assets } = useOracleAssets();

  const onAmountValueChange = (value: number) => {
    setReceiveAmount(value || 0);
  };

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
    />
  );
};
