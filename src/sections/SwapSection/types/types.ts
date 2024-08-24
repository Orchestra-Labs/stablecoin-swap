export interface Asset {
  denom: string;
  amount: string;
}

export interface WalletAssets {
  address: string;
  assets: Asset[];
}
