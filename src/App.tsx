import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Loader, ScrollToTop } from '@/components';

import { AppRouter } from './app/Router';
import '@interchain-ui/react/styles';
import { assets, chains } from 'chain-registry/testnet';
import { chainEndpoint, defaultChainName } from '@/constants';
import { wallets } from '@cosmos-kit/keplr';
import { ChainProvider } from '@cosmos-kit/react';
import { SignerOptions } from 'cosmos-kit';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const signerOptions: SignerOptions = {};

export default function App() {
  return (
    <ChainProvider
      chains={chains.filter(c => c.chain_name === defaultChainName)} // supported chains
      assetLists={assets} // supported asset lists
      wallets={wallets} // supported wallets,
      signerOptions={signerOptions}
      endpointOptions={{
        isLazy: true,
        endpoints: {
          symphonytestnet: {
            rpc: chainEndpoint.symphonytestnet.rpc,
            rest: chainEndpoint.symphonytestnet.rest,
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
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
        </RecoilRoot>
      </QueryClientProvider>
    </ChainProvider>
  );
}
