import { Spinner } from '@/assets/icons';
import { useGetStablePools } from '@/sections';
import { StablecoinsInfoItem } from '@/sections/StablestakingSection/components/StablecoinsInfoItem';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/ui-kit';

export const StablecoinsInfo = () => {
  const { data, isLoading } = useGetStablePools();

  const hasData = !!data;

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
        <h3 className="text-h6">Stablecoins Info</h3>
      </div>
      <div className="border-t border-neutral-2 my-3" />
      <div>
        {hasData ? (
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="h-8">Name</TableHead>
                <TableHead className="w-[110px] h-8 text-right">
                  Total Staked
                </TableHead>
                <TableHead className="w-[110px] h-8 text-right">
                  Total Shares
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.pools?.map(pool => (
                <StablecoinsInfoItem key={pool.denom} pool={pool} />
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
