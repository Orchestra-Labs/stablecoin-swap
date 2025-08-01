export interface IUserUnbondingInfo {
  address: string;
  amount: string;
  denom: string;
  unbond_epoch: string;
}

export type UserUnbondingResponse = {
  info: IUserUnbondingInfo;
};
