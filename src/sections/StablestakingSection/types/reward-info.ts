export type StablestakingRewardInfo = {
  pool: {
    denom: string;
    total_staked: string;
    total_shares: string;
  };
  reward: {
    denom: string;
    amount: string;
  };
};
