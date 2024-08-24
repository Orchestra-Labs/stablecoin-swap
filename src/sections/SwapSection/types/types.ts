export interface Asset {
  denom: string;
  amount: string;
}

export interface ChainData {
  address: string;
  assets: Asset[];
}
