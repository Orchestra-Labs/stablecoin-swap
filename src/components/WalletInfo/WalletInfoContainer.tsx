import { useChain } from '@cosmos-kit/react';
import { CircleDollarSign } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/Card';
import { Table, TableBody, TableCell, TableRow } from '@/components/Table';
import { defaultChainName } from '@/constants';
import { useToast, useWalletAssets } from '@/hooks';

const AssetRow = (asset: {
  denom: string;
  amount: string;
  isIbc: boolean;
  logo?: string;
  symbol?: string;
  exponent?: number;
}) => {
  const { denom, amount, isIbc, logo, exponent, symbol } = asset;
  const amountNumber = parseInt(amount, 10);
  const normalizedAmount = amountNumber / 10 ** (exponent ?? 0);

  return (
    <TableRow key={denom} className="w-full h-12">
      <TableCell className="w-[20%]">
        {logo ? (
          <img alt={`logo_${denom}`} className="w-6 h-6" src={logo} />
        ) : (
          <CircleDollarSign className="h-6 w-6" />
        )}
      </TableCell>
      <TableCell className="font-medium w-[30%] truncate">{symbol}</TableCell>
      <TableCell className="w-[25%] text-right truncate">
        {normalizedAmount.toLocaleString('en-US', {
          maximumFractionDigits: 2,
        })}
      </TableCell>
      <TableCell className="w-[25%] text-right truncate">
        {isIbc ? 'ibc' : 'Native Token'}
      </TableCell>
    </TableRow>
  );
};

export const WalletInfoContainer = () => {
  const { username, address } = useChain(defaultChainName);
  const { data } = useWalletAssets();
  const { toast } = useToast();

  const assets = data?.resolvedAddresses || [];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address!);
    toast({
      title: 'Address copied to clipboard',
      description: 'You can now paste it anywhere',
    });
  };

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const container = tableContainerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      const showTopShadow = scrollTop > 0;
      const showBottomShadow =
        scrollTop === 0 || scrollTop + clientHeight < scrollHeight;

      // Show top shadow when not at the top
      setShowTopShadow(showTopShadow);

      // Show bottom shadow until the bottom is reached
      setShowBottomShadow(showBottomShadow);
    };

    const container = tableContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize shadow visibility

    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <Card className="w-full max-w-[380px] bg-black backdrop-blur-xl">
      <CardHeader>
        <CardTitle>Wallet {username}</CardTitle>
        <CardDescription
          className="hover:bg-blue-hover hover:cursor-pointer p-2 rounded-md"
          onClick={copyToClipboard}
        >
          {address}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="overflow-y-auto max-h-[156px] hide-scrollbar"
          style={boxShadowStyles}
          ref={tableContainerRef}
        >
          <Table className="border table-fixed w-full">
            <TableBody>
              {assets.map(asset => {
                return AssetRow(asset);
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
