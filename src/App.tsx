import '@interchain-ui/react/styles';

import { wallets } from '@cosmos-kit/keplr';
import { ChainProvider } from '@cosmos-kit/react';
import { getSigningCosmosClientOptions } from '@orchestra-labs/symphonyjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { assets, chains } from 'chain-registry/testnet';
import { SignerOptions } from 'cosmos-kit';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Loader, ScrollToTop } from '@/components';
import { defaultChainName } from '@/constants';

import { AppRouter } from './app/Router';

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
};

export default function App() {
  return (
    <ChainProvider
      chains={chains.filter(c => c.chain_name === defaultChainName)} // supported chains
      assetLists={assets} // supported asset lists
      wallets={wallets} // supported wallets,
      signerOptions={signerOptions}
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