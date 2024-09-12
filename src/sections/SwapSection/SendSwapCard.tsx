import { useChain } from '@cosmos-kit/react';
import { useAtomValue } from 'jotai';
import { SwapCard } from '@/components/Swap';
import { defaultChainName, IBCPrefix } from '@/constants';
import { SendStateAtom, WalletAssetsAtom } from './atoms';
import { truncateString } from './utils';
import { Asset } from './types';

export const SendSwapCard = ({
  updateSendAsset,
  updateSendAmount,
}: {
  updateSendAsset: (newAsset: Asset, propagateChanges?: boolean) => void;
  updateSendAmount: (newSendAmount: number, propagateChanges?: boolean) => void;
}) => {
  const sendState = useAtomValue(SendStateAtom);

  const walletAssets = useAtomValue(WalletAssetsAtom);
  const { address } = useChain(defaultChainName);

  const onAssetValueChange = (denom: string) => {
    const selectedAsset = walletAssets.find(asset => asset.denom === denom);
    if (selectedAsset) {
      // Update and propagate changes
      updateSendAsset(selectedAsset, true);
    }
  };

  // Handle change in send amount
  const onAmountValueChange = (value: number) => {
    updateSendAmount(value ?? 0, true);
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
      amountValue={sendState.amount}
      selectedAsset={sendState.asset || null}
      onAssetValueChange={onAssetValueChange}
      onAmountValueChange={onAmountValueChange}
      address={address ?? ''}
      addressInputEnabled={false}
    />
  );
};
