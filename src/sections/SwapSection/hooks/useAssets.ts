import { useState, useEffect } from 'react';

interface Asset {
  denom: string;
  amount: string;
}

export const useAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await fetch(
        'https://symphony-api.kleomedes.network/osmosis/oracle/v1beta1/denoms/exchange_rates',
      );
      const data = await response.json();
      setAssets(data.exchange_rates);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  return assets;
};
