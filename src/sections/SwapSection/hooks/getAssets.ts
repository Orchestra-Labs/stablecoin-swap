import { useState, useEffect } from 'react';
import { Asset } from '../types/types';

export const getAssets = (rpcUrl: string) => {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch(
          `${rpcUrl}/osmosis/oracle/v1beta1/denoms/exchange_rates`,
        );
        const data = await response.json();

        const formattedAssets = data.exchange_rates.map((asset: any) => ({
          ...asset,
          amount: parseFloat(asset.amount).toFixed(6),
          isIbc: false,
        }));

        setAssets(formattedAssets);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, [rpcUrl]);

  return assets;
};
