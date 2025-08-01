import { FC, useMemo } from 'react';

import { STABLECOINS_ASSETS_REGISTRY } from '@/constants';
import { StablePool } from '@/sections/StablestakingSection/types/stable-pools';
import { convertToGreaterUnit } from '@/sections/StablestakingSection/utils/common';
import { TableCell, TableRow } from '@/ui-kit';

type StablecoinsInfoItemProps = {
  pool: StablePool;
};

export const StablecoinsInfoItem: FC<StablecoinsInfoItemProps> = ({ pool }) => {
  const asset = STABLECOINS_ASSETS_REGISTRY[pool.denom];

  const totalStakedAmount = useMemo(() => {
    if (!pool.total_staked) {
      return `0`;
    }
    return convertToGreaterUnit(
      parseFloat(pool.total_staked ?? '0'),
      6,
    ).toFixed(4);
  }, [pool]);

  const totalSharesAmount = useMemo(() => {
    if (!pool.total_shares) {
      return `0`;
    }
    return convertToGreaterUnit(
      parseFloat(pool.total_shares ?? '0'),
      6,
    ).toFixed(4);
  }, [pool]);

  return (
    <TableRow>
      <TableCell className="font-medium max-w-[200px] truncate text-ellipsis overflow-hidden whitespace-nowrap">
        {asset.symbol}
      </TableCell>
      <TableCell className="text-right">{totalStakedAmount}</TableCell>
      <TableCell className="text-right">{totalSharesAmount}</TableCell>
    </TableRow>
  );
};
