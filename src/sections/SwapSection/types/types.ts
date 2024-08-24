export interface Asset {
  denom: string;
  amount: string;
  isIbc: boolean;
}

export interface WalletAssets {
  address: string;
  assets: Asset[];
}
