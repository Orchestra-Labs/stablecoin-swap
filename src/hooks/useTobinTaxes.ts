import { useChain } from '@cosmos-kit/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { defaultChainName } from '@/constants';

export function useFeeInfo() {
  const { getRestEndpoint } = useChain(defaultChainName);

  const fetchTobinTaxes = useQuery({
    queryKey: ['tobinTaxes'],
    queryFn: async () => {
      const restEndpoint = await getRestEndpoint();
      const response = await fetch(
        `${restEndpoint}/symphony/oracle/v1beta1/denoms/tobin_taxes`,
      );
      const data = await response.json();
      return data;
    },
  });

  const fetchTaxRate = useQuery({
    queryKey: ['taxRate'],
    queryFn: async () => {
      const restEndpoint = await getRestEndpoint();
      const response = await fetch(
        `${restEndpoint}/symphony/treasury/v1beta1/tax_rate`,
      );
      const data = await response.json();
      return data;
    },
  });

  useEffect(() => {
    if (fetchTobinTaxes.isFetched) {
      console.log('Tobin Taxes:', fetchTobinTaxes.data);
    }

    if (fetchTaxRate.isFetched) {
      console.log('Tax Rate:', fetchTaxRate.data);
    }
  }, [fetchTobinTaxes.isFetched, fetchTaxRate.isFetched]);

  return {
    isLoading: fetchTobinTaxes.isLoading || fetchTaxRate.isLoading,
    error: fetchTobinTaxes.error || fetchTaxRate.error,
    tobinTaxes: fetchTobinTaxes.data,
    taxRate: fetchTaxRate.data,
  };
}
