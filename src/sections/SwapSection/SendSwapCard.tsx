import { useAtom } from 'jotai/react/useAtom';
import { useAtomValue } from 'jotai/react/useAtomValue';
import { useSetAtom } from 'jotai/react/useSetAtom';

import { SwapCard } from '@/components/Swap';
import { SendAmountAtom } from '@/sections/SwapSection/atoms/SendAmountAtom';
import { SendAssetAtom } from '@/sections/SwapSection/atoms/SendAssetAtom';
import { WalletAssetsAtom } from '@/sections/SwapSection/atoms/WalletAssetsAtom';

export const SendSwapCard = () => {
  const setSendAsset = useSetAtom(SendAssetAtom);
  const [sendAmount, setSendAmount] = useAtom(SendAmountAtom);

  const walletAssets = useAtomValue(WalletAssetsAtom);

  const onAmountValueChange = (value: number) => {
    setSendAmount(value || 0);
  };

  const onAssetValueChange = (value: string) => {
    setSendAsset(value || '');
  };

  return (
    <SwapCard
      title="Send"
      selectPlaceholder="Select asset to send"
      options={Object.assign(
        {},
        ...walletAssets.map(x => ({ [x.denom]: x.denom })),
      )}
      amountValue={sendAmount}
      onAssetValueChange={onAssetValueChange}
      onAmountValueChange={onAmountValueChange}
    />
  );
};
