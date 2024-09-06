import '@interchain-ui/react/styles';

import { getSigningCosmosClientOptions } from '@orchestra_labs/symphonyjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Loader, ScrollToTop } from '@/components';

import { AppRouter } from './app/Router';
import '@interchain-ui/react/styles';
import { assets, chains } from 'chain-registry/testnet';
import { defaultChainName } from '@/constants';
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
  return (
    <ChainProvider
      chains={chains.filter(c => c.chain_name === defaultChainName)} // supported chains
      assetLists={assets} // supported asset lists
      wallets={wallets} // supported wallets,
      signerOptions={signerOptions}
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
