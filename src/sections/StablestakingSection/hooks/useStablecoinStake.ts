import { DeliverTxResponse, GasPrice } from '@cosmjs/stargate';
import { useChain } from '@cosmos-kit/react';
import { getSigningSymphonyClient } from '@orchestra-labs/symphonyjs';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { defaultChainName } from '@/constants';
import { wrapPromiseWithTimeout } from '@/helpers/timeout';
import { StablecoinStakeParams } from '@/sections/StablestakingSection/types/stake';

type Params = {
  body: StablecoinStakeParams;
  feeDenom: string;
};

export const useStablecoinStake = (
  options?: UseMutationOptions<DeliverTxResponse, Error, Params, unknown>,
) => {
  const {
    address: walletAddress,
    getRpcEndpoint,
    getOfflineSignerDirect,
  } = useChain(defaultChainName);

  const wrappedStakeStablecoin = async (
    params: Params,
  ): Promise<DeliverTxResponse> => {
    const endpoint = '/symphony.stablestaking.v1beta1.MsgStakeTokens';

    const messages = [
      {
        typeUrl: endpoint,
        value: {
          staker: params.body.staker,
          amount: params.body.amount,
        },
      },
    ];

    try {
      const client = await getSigningSymphonyClient({
        rpcEndpoint: await getRpcEndpoint(),
        signer: getOfflineSignerDirect(),
      });

      const defaultGasPrice = GasPrice.fromString(`0.025${params.feeDenom}`);
      let gasEstimation = await client.simulate(walletAddress!, messages, '');

      gasEstimation = Math.ceil(gasEstimation * 1.1);

      const signAndBroadcastPromise = client.signAndBroadcast(
        params.body.staker!,
        messages,
        {
          amount: [
            {
              denom: 'note',
              amount: (
                gasEstimation * defaultGasPrice.amount.toFloatApproximation()
              ).toFixed(0),
            },
          ],
          gas: gasEstimation.toString(),
        },
      );
      const response = await wrapPromiseWithTimeout<DeliverTxResponse>(
        signAndBroadcastPromise,
        20000,
        new Error('Approval timeout exceeded, please try again'),
      );

      console.log('Stable-Staking: stake', response);

      return response;
    } catch (error) {
      console.error('Error staking stablecoin:', error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: wrappedStakeStablecoin,
    ...options,
  });
};
