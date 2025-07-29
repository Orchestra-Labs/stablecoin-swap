export interface IStaker {
  denom: string;
  count: string;
}

export type TotalStakersResponse = {
  stakers: IStaker[];
};
