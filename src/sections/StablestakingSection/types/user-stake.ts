export interface IStakeInfo {
  denom: string;
  amount: string;
}

export type TotalUserStakes = {
  stakes: IStakeInfo[];
};
