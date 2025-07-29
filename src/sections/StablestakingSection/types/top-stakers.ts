export interface ITopStaker {
  address: string;
  staked: string;
}

export type TopStakersResponse = {
  stakers: ITopStaker[];
};
