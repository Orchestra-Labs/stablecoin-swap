import { useChain } from '@cosmos-kit/react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { SwapCard } from '@/components/Swap';
import { defaultChainName, IBCPrefix } from '@/constants';
import { SendAmountAtom, SendAssetAtom, WalletAssetsAtom } from './atoms';
import { truncateString } from './utils';

export const SendSwapCard = () => {
  const setSendAsset = useSetAtom(SendAssetAtom);
  const [sendAmount, setSendAmount] = useAtom(SendAmountAtom);

  const walletAssets = useAtomValue(WalletAssetsAtom);
  const { address } = useChain(defaultChainName);

  const onAmountValueChange = (value: number) => {
    setSendAmount(value ?? 0);
  };

  const onAssetValueChange = (value: string) => {
    console.log('send asset value', value);
    setSendAsset(value);
  };

  return (
    <SwapCard
      title="Send"
      selectPlaceholder="Select asset to send"
      options={Object.assign(
        {},
        ...walletAssets.map(x => ({
          [x.denom]: truncateString(IBCPrefix, x.symbol ? x.symbol : x.denom),
        })),
      )}
      amountValue={sendAmount}
      onAssetValueChange={onAssetValueChange}
      onAmountValueChange={onAmountValueChange}
      address={address ?? ''}
      addressInputEnabled={false}
    />
  );
};
