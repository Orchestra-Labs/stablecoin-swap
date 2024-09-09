import { useChain } from '@cosmos-kit/react';
import { Provider } from 'jotai';
import { Wallet } from 'lucide-react';

import { Button } from '@/components/Button/button';
import { defaultChainName } from '@/constants';
import { SwapSection } from '@/sections';

export const Home = () => {
  const { isWalletConnected, connect } = useChain(defaultChainName);

  console.log('isWalletConnected', isWalletConnected);

  return (
    <Provider>
      <div>
        {isWalletConnected ? (
          <SwapSection />
        ) : (
          <div className="h-screen justify-center flex items-center">
            <Button variant="outline" onClick={connect}>
              <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </Provider>
  );
};
