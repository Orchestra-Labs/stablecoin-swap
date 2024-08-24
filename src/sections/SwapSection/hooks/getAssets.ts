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
        setAssets(data.exchange_rates);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, [rpcUrl]);

  return assets;
};
