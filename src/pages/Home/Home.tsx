import { useEffect } from 'react';
import { useChain } from '@cosmos-kit/react';
import { Provider } from 'jotai';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/Button/button';
import { defaultChainName } from '@/constants';
import { SwapSection } from '@/sections';

export const Home = () => {
  const { isWalletConnected, connect } = useChain(defaultChainName);

  useEffect(() => {
    if (isWalletConnected) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    }
  }, [isWalletConnected]);

  return (
    <Provider>
      <div>
        {isWalletConnected ? (
          <SwapSection />
        ) : (
          <div className="h-screen justify-center flex items-center">
            <Button
              variant="outline"
              onClick={e => {
                e.preventDefault();
                connect();
              }}
            >
              <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </Provider>
  );
};
