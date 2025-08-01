export interface ITotalStakeInfo {
  denom: string;
  amount: string;
}

export type TotalUserStakes = {
  stakes: ITotalStakeInfo[];
};

export type UserStake = {
  stakes: {
    address: string;
    shares: string;
    epoch: string;
  };
};
