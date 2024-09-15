import { Coin } from '@cosmjs/amino';
import { DeliverTxResponse, isDeliverTxSuccess } from '@cosmjs/stargate';
import { useChain } from '@cosmos-kit/react';
import { getSigningOsmosisClient, osmosis } from '@orchestra-labs/symphonyjs';
import { truncateString } from '@/sections';
import { wrapPromiseWithTimeout } from '@/helpers/timeout';
import { useToast } from '@/hooks/useToast';

const { swapSend } = osmosis.market.v1beta1.MessageComposer.withTypeUrl;

export const useSwapTx = (chainName: string) => {
  const {
    address: signerAddress,
    isWalletConnected,
    getRpcEndpoint,
    getOfflineSigner
  } = useChain(chainName);
  const { toast } = useToast();

  const copyToClipboard = (txHash: string) => {
    navigator.clipboard.writeText(txHash);

    toast({
      title: 'Copied to clipboard!',
      description: `Transaction hash ${truncateString('', txHash)} has been copied.`,
    });
  };

  const swapTx = async (
    fromAddress: string,
    toAddress: string,
    offerCoin: Coin,
    askDenom: string,
  ) => {
    if (!fromAddress || !toAddress || !offerCoin || !askDenom) {
      toast({
        variant: 'destructive',
        title: 'Swap Failed!',
        description: 'Please fill in all the required fields',
      });

      return;
    }

    if (!isWalletConnected || !signerAddress) {
      toast({
        variant: 'destructive',
        title: 'Swap Failed!',
        description: 'Please connect a wallet',
      });

      return;
    }
    try {
      const client = await getSigningOsmosisClient({
        rpcEndpoint: await getRpcEndpoint(),
        signer: getOfflineSigner(),
      });

      const swapMsg = swapSend({
        fromAddress,
        toAddress,
        offerCoin,
        askDenom,
      });

      const txToastProgress = toast({
        title: 'Swap in Progress',
        description: 'Waiting for transaction to be included in the block',
      });

      const gasAmount =
        offerCoin.denom === 'note' || askDenom === 'note' ? '100000' : '350000';
      const signAndBroadcastPromise = client.signAndBroadcast(
        signerAddress!,
        [swapMsg],
        {
          amount: [{ denom: 'note', amount: '1000000' }],
          gas: gasAmount,
        },
      );
      const response = await wrapPromiseWithTimeout<DeliverTxResponse>(
        signAndBroadcastPromise,
        20000,
        new Error('Approval timeout exceeded, please try again'),
      );

      txToastProgress.dismiss();
      if (isDeliverTxSuccess(response)) {
        toast({
          title: 'Swap Successful!',
          description: `Transaction ${truncateString('', response.transactionHash)} has been included in the block. Click to copy the hash.`,
          onClick: () => copyToClipboard(response.transactionHash),
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Swap Failed!',
          description: `Transaction ${truncateString('', response.transactionHash)} failed to be included in the block, error: ${response.rawLog}`,
          onClick: () => copyToClipboard(response.transactionHash),
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Swap Failed!',
          description: error.message ?? 'An unexpected error has occurred',
        });
      }
    }
  };

  return {
    swapTx,
  };
};
