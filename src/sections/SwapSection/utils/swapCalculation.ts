import BigNumber from 'bignumber.js';

export function calculateReceiveAmount(
  amount: number,
  rate: BigNumber,
): BigNumber {
  if (!rate || !amount) {
    return BigNumber(0);
  }

  return BigNumber(amount).multipliedBy(rate);
}
