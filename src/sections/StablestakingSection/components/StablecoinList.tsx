import { useMemo, useState } from 'react';

import { StablecoinListItem } from '@/sections/StablestakingSection/components/StablecoinListItem';
import { StablestakingDialog } from '@/sections/StablestakingSection/components/StablestakingDialog';
import { useGetParams } from '@/sections/StablestakingSection/hooks';

export const StablecoinList = () => {
  const { data: stakingParams } = useGetParams();

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    action: 'stake' | 'unstake' | null;
    denom: string;
  }>({ isOpen: false, action: null, denom: '' });

  const handleOpenDialog = (action: 'stake' | 'unstake', denom: string) => {
    setDialogState({ isOpen: true, action, denom });
  };

  const handleCloseDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  const tokens = useMemo(() => {
    if (!stakingParams) return [];

    return stakingParams.params.supported_tokens;
  }, [stakingParams]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full justify-between mt-3">
      {tokens.map(denom => (
        <StablecoinListItem
          key={denom}
          denom={denom}
          handleOpenDialog={handleOpenDialog}
        />
      ))}

      <StablestakingDialog
        isOpen={dialogState.isOpen}
        onOpenChange={handleCloseDialog}
        action={dialogState.action || 'stake'}
        denom={dialogState.denom}
      />
    </div>
  );
};
