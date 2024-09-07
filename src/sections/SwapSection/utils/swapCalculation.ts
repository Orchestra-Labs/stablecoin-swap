export function calculateReceiveAmount(amount: string, rate: string): number {
  if (!rate || !amount) {
    return 0;
  }

  return parseFloat(amount) * parseFloat(rate);
}
