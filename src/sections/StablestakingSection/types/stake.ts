export type StablecoinStakeParams = {
  staker: string;
  amount: {
    denom: string;
    amount: string;
  };
};
