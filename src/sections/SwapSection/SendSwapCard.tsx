import { useChain } from '@cosmos-kit/react';
import { useAtom, useAtomValue } from 'jotai';
import { SwapCard } from '@/components/Swap';
import { defaultChainName, IBCPrefix } from '@/constants';
import { SendAmountAtom, SendAssetAtom, WalletAssetsAtom } from './atoms';
import { truncateString } from './utils';

export const SendSwapCard = () => {
  const [sendAsset, setSendAsset] = useAtom(SendAssetAtom);
  const [sendAmount, setSendAmount] = useAtom(SendAmountAtom);

  const walletAssets = useAtomValue(WalletAssetsAtom);
  const { address } = useChain(defaultChainName);

  const onAmountValueChange = (value: number) => {
    setSendAmount(value ?? 0);
  };

  const onAssetValueChange = (denom: string) => {
    const asset = walletAssets.find(asset => asset.denom === denom);
    if (asset) {
      setSendAsset(asset);
    }
  };

  return (
    <SwapCard
      title="Send"
      selectPlaceholder="Select asset to send"
      options={walletAssets.reduce(
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
      amountValue={sendAmount}
      selectedAsset={sendAsset || null}
      onAssetValueChange={onAssetValueChange}
      onAmountValueChange={onAmountValueChange}
      address={address ?? ''}
      addressInputEnabled={false}
    />
  );
};
