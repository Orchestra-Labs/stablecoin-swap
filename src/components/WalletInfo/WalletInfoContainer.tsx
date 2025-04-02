import { useChain } from '@cosmos-kit/react';
import { CircleDollarSign, LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { defaultChainName, IBCPrefix, walletPrefix } from '@/constants';
import { useToast, useWalletAssets } from '@/hooks';
import { Asset, truncateString } from '@/sections';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../Card';
import { Table, TableBody, TableCell, TableRow } from '../Table';

const AssetRow = ({
  asset,
  onRowClick,
}: {
  asset: Asset;
  onRowClick: (asset: Asset) => void;
}) => {
  const { denom, amount, logo, exponent = 6, symbol } = asset;
  const amountNumber = parseInt(amount, 10);
  const normalizedAmount = amountNumber / 10 ** exponent;

  const handleRowClick = () => {
    onRowClick(asset);
  };

  return (
    <TableRow
      key={denom}
      className="w-full h-12 cursor-pointer"
      onClick={handleRowClick}
    >
      <TableCell className="w-[20%]">
        {logo ? (
          <img alt={`logo_${denom}`} className="w-6 h-6" src={logo} />
        ) : (
          <CircleDollarSign className="h-6 w-6" />
        )}
      </TableCell>
      <TableCell className="font-medium w-[40%] truncate">
        {truncateString(IBCPrefix, symbol || '')}
      </TableCell>
      <TableCell className="w-[40%] text-right truncate">
        {normalizedAmount.toLocaleString('en-US', {
          maximumFractionDigits: exponent,
        })}
      </TableCell>
    </TableRow>
  );
};

export const WalletInfoContainer = ({
  updateSendAsset,
}: {
  updateSendAsset: (asset: Asset, propagateChanges?: boolean) => void;
}) => {
  const { username, address, disconnect } = useChain(defaultChainName);
  const { data } = useWalletAssets();
  const { toast } = useToast();

  const assets = data?.resolvedAddresses || [];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);

    toast({
      title: `Copied to clipboard!`,
      description: `Address ${truncateString(walletPrefix, text)} has been copied.`,
    });
  };

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const container = tableContainerRef.current;
      if (!container) return;

      const { scrollTop } = container;
      const { scrollHeight } = container;
      const { clientHeight } = container;

      const showTopShadow = scrollTop > 0;
      const showBottomShadow = scrollTop + clientHeight < scrollHeight;

      setShowTopShadow(showTopShadow);
      setShowBottomShadow(showBottomShadow);
    };

    const container = tableContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [assets]);

  const boxShadowStyles = {
    boxShadow: [
      showTopShadow ? 'inset 0 12px 10px -8px rgba(255, 255, 255, 0.8)' : '',
      showBottomShadow
        ? 'inset 0 -12px 10px -8px rgba(255, 255, 255, 0.8)'
        : '',
    ]
      .filter(Boolean)
      .join(', '),
  };

  return (
    <Card className="w-full max-w-[400px] bg-black backdrop-blur-xl">
      <CardHeader className="relative">
        <CardTitle>Wallet: {username}</CardTitle>
        <CardDescription
          className="hover:bg-blue-hover hover:cursor-pointer p-2 rounded-md"
          onClick={() => copyToClipboard((address || '').toString())}
        >
          {address}
        </CardDescription>
        <button
          className="absolute top-1 right-2.5 inline-block text-blue"
          onClick={() => disconnect()}
          aria-label="Disconnect wallet"
          type="button"
        >
          <LogOut className="inline-block size-5" />
        </button>
      </CardHeader>
      <CardContent>
        <div
          className="overflow-y-auto min-h-[156px] max-h-[156px] hide-scrollbar"
          style={boxShadowStyles}
          ref={tableContainerRef}
        >
          <Table className="border table-fixed w-full">
            <TableBody>
              {assets.map(asset => (
                <AssetRow
                  key={asset.denom}
                  asset={asset}
                  onRowClick={asset => updateSendAsset(asset, true)} // Update and propagate changes
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
