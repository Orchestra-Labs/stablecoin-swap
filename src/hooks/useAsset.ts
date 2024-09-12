import { Asset, AssetDenomUnit } from '@chain-registry/types';
import { useChain } from '@cosmos-kit/react';

const matchDenom = (denom: string, denomUnits: AssetDenomUnit[]): boolean => {
  return denomUnits.map(d => d.denom).some(x => x === denom);
};

export const useAsset = (chainName: string) => {
  const { assets } = useChain(chainName);

  const find = (denom: string): Asset | undefined => {
    const assetsList = assets?.assets ?? [];

    return assetsList.find(asset => matchDenom(denom, asset.denom_units));
  };

  return { find };
};
