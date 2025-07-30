export interface StablePool {
  denom: string;
  total_staked: string;
  total_shares: string;
}

export type StablePoolsResponse = {
  pools: StablePool[];
};
