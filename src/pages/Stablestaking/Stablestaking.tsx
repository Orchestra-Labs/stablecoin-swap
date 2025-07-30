import { useChain } from '@cosmos-kit/react';
import { Wallet } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components';
import { defaultChainName } from '@/constants';
import { StablestakingSection } from '@/sections';

export const Stablestaking = () => {
  const { isWalletConnected, connect } = useChain(defaultChainName);

  useEffect(() => {
    if (isWalletConnected) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    }
  }, [isWalletConnected]);

  return (
    <div>
      {isWalletConnected ? (
        <StablestakingSection />
      ) : (
        <div className="h-screen justify-center flex items-center">
          <Button
            variant="outline"
            onClick={async e => {
              e.preventDefault();
              await connect();
            }}
          >
            <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        </div>
      )}
    </div>
  );
};
