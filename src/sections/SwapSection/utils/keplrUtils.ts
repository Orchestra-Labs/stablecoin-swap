import { SigningStargateClient } from '@cosmjs/stargate';
import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';

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
): Promise<SigningStargateClient | undefined> => {
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

  // Log the address to the console
  console.log(`Connected to blockchain with address: ${accounts[0].address}`);

  // Alternatively, you can get the address directly using getKey method
  const key = await keplr.getKey(chainId);
  console.log(`Address from getKey method: ${key.bech32Address}`);

  // NOTE: fails here, but is it necessary?
  // Initialize the SigningStargateClient with the offline signer
  const client = await SigningStargateClient.connectWithSigner(
    'https://lcd-cosmoshub.keplr.app', // Use proxy path configured in Vite
    offlineSigner,
  );
  return client;
};
