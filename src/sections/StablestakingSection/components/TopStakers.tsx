import { useState } from 'react';

import { Spinner } from '@/assets/icons';
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { STABLECOINS_ASSETS_REGISTRY } from '@/constants';
import { useGetTopStakers } from '@/sections';
import {
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui-kit';

const Option = (props: { value: string; label: string; logo?: string }) => {
  const { value, label } = props;

  return (
    <SelectItem key={value} value={value}>
      <div className="flex items-center gap-2">
        <span>{label}</span>
      </div>
    </SelectItem>
  );
};

export const TopStakers = () => {
  const [selectedDenom, setSelectedDenom] = useState(
    STABLECOINS_ASSETS_REGISTRY.uusd.denom,
  );

  const { data, isLoading } = useGetTopStakers(selectedDenom);

  const hasData = data && data?.stakers?.length > 0;

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Spinner className="w-10 h-10 animate-spin fill-blue" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-h6">Top 10 Stakers</h3>
        <Select
          value={selectedDenom}
          onValueChange={(value: string) => {
            setSelectedDenom(value);
          }}
        >
          <SelectTrigger className="w-auto h-7 py-1 border-neutral-3 bg-transparent hover:border-neutral-1 hover:text-neutral-1 focus:outline-0 focus:border-blue focus:text-white placeholder:text-sm placeholder:text-neutral-3 focus:ring-offset-0">
            <SelectValue placeholder="Placeholder" />
          </SelectTrigger>
          <SelectContent className="bg-black backdrop-blur-xl border-neutral-3">
            <SelectGroup>
              {Object.keys(STABLECOINS_ASSETS_REGISTRY).map(option => (
                <Option
                  key={option}
                  value={option}
                  label={STABLECOINS_ASSETS_REGISTRY[option]?.symbol || ''}
                />
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="border-t border-neutral-2 my-3" />
      <div>
        {hasData ? (
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="h-8">Wallet</TableHead>
                <TableHead className="w-[110px] h-8 text-right">
                  Total Staked
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.stakers?.map(staker => (
                <TableRow key={staker.address}>
                  <TableCell className="font-medium max-w-[200px] truncate text-ellipsis overflow-hidden whitespace-nowrap">
                    {staker.address}
                  </TableCell>
                  <TableCell className="text-right">{staker.staked}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center text-gray-500">No stakers found</div>
          </div>
        )}
      </div>
    </>
  );
};
