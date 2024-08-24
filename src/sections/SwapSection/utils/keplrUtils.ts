import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';
import { OfflineSigner } from '@cosmjs/proto-signing';

declare global {
  interface Window extends KeplrWindow {}
}

export const getKeplr = async (): Promise<Keplr | undefined> => {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === 'complete') {
    return window.keplr;
  }

  return new Promise(resolve => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        resolve(window.keplr);
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};

export const connectKeplr = async (
  chainId: string,
): Promise<OfflineSigner | undefined> => {
  const keplr = await getKeplr();
  if (!keplr) {
    throw new Error('Keplr extension is not available');
  }

  // Enable Keplr for the specified chain
  await keplr.enable(chainId);

  // Get the offline signer from Keplr
  const offlineSigner = window.getOfflineSigner?.(chainId);
  if (!offlineSigner) {
    throw new Error('OfflineSigner is not available');
  }

  // Get the accounts from the offline signer
  const accounts = await offlineSigner.getAccounts();
  console.log(`Connected to blockchain with address: ${accounts[0].address}`);

  // Return the offline signer instead of the client
  return offlineSigner;
};
