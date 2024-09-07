export interface Asset {
  denom: string;
  amount: string;
  isIbc: boolean;
  logo?: string;
}

export interface WalletAssets {
  address: string;
  assets: Asset[];
}
