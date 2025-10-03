import { Asset } from '@/sections';

export const rpcUrl = 'https://symphony-api.kleomedes.network';
export const defaultChainName = 'symphony';
export const walletPrefix = 'symphony1';
export const IBCPrefix = 'ibc/';
export const lesserExponentDefault = 0;
export const greaterExponentDefault = 6;

type AssetRegistry = {
  [key: string]: Asset;
};

// TODO: pull from remote instead
export const STABLECOINS_ASSETS_REGISTRY: AssetRegistry = {
  mld: {
    denom: 'note',
    amount: '1',
    isIbc: false,
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/symphony/imaged/mld.png',
    symbol: 'MLD',
    exponent: 6,
  },
  uusd: {
    denom: 'uusd',
    amount: '10',
    isIbc: false,
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/symphony/images/husd.png',
    symbol: 'HUSD',
    exponent: 6,
  },
  ukhd: {
    denom: 'uhkd',
    amount: '1.282',
    isIbc: false,
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/symphony/images/hhkd.png',
    symbol: 'HHKD',
    exponent: 6,
  },
  uvnd: {
    denom: 'uvnd',
    amount: '0.000399',
    isIbc: false,
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/symphony/images/hvnd.png',
    symbol: 'HVND',
    exponent: 6,
  },
};

export const localAssetRegistry: AssetRegistry = {
  ...STABLECOINS_ASSETS_REGISTRY,
  note: {
    denom: 'note',
    amount: '1',
    isIbc: false,
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/symphony/images/mld.png',
    symbol: 'MLD',
    exponent: 6,
  },
};
