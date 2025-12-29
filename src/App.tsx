import '@interchain-ui/react/styles';

import { wallets as keplrWallets } from '@cosmos-kit/keplr';
import { wallets as leapWallets } from '@cosmos-kit/leap-mobile';
import { wallets as ariaWallets } from '@cosmos-kit/aria-extension';
import { ChainProvider } from '@cosmos-kit/react';
import { getSigningCosmosClientOptions } from '@orchestra-labs/symphonyjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { assets, chains } from 'chain-registry';
import { SignerOptions } from 'cosmos-kit';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Loader, ScrollToTop } from '@/components';
import { defaultChainName } from '@/constants';
import { setupWalletErrorFilter } from '@/helpers';

import { AppRouter } from './app/Router';

// Setup wallet error filtering (silences "wallet not installed" errors, shows toasts for user actions)
setupWalletErrorFilter();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const signerOptions: SignerOptions = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signingStargate: (_: unknown) => {
    return getSigningCosmosClientOptions();
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  preferredSignType: (_: unknown) => {
    // `preferredSignType` determines which signer is preferred for `getOfflineSigner` method. By default `amino`. It might affect the `OfflineSigner` used in `signingStargateClient` and `signingCosmwasmClient`. But if only one signer is provided, `getOfflineSigner` will always return this signer, `preferredSignType` won't affect anything.
    return 'direct';
  },
};

export default function App() {
  const supportedChains = chains.filter(c => c.chain_name === defaultChainName);

  return (
    <ChainProvider
      chains={supportedChains} // supported chains
      assetLists={assets} // supported asset lists
      wallets={[...ariaWallets, ...keplrWallets, ...leapWallets] as any} // supported wallets,
      signerOptions={signerOptions}
      walletConnectOptions={{
        signClient: {
          projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
        },
      }}
      throwErrors={true}
    >
      <QueryClientProvider client={queryClient}>
        <Suspense
          fallback={
            <div className="w-screen h-screen">
              <Loader />
            </div>
          }
        >
          <BrowserRouter>
            <ScrollToTop />
            <AppRouter />
          </BrowserRouter>
        </Suspense>
      </QueryClientProvider>
    </ChainProvider>
  );
}
