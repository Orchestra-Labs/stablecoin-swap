import { useChain } from '@cosmos-kit/react';
import { CircleDollarSign } from 'lucide-react';

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
}) => {
  const { denom, amount, isIbc, logo } = asset;
  const amountNumber = parseInt(amount, 10);
  return (
    <TableRow key={denom}>
      <TableCell>
        {logo ? (
          <img alt={`logo_${denom}`} className="w-4 h-4" src={logo} />
        ) : (
          <CircleDollarSign />
        )}
      </TableCell>
      <TableCell className="font-medium">{denom}</TableCell>
      <TableCell>
        {amountNumber.toLocaleString('en-US', {
          maximumFractionDigits: 2,
        })}
      </TableCell>
      <TableCell>{isIbc ? 'ibc' : 'Native Token'}</TableCell>
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

  return (
    <Card className="w-[380px] bg-black backdrop-blur-xl">
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
        <Table className="border">
          <TableBody>
            {assets.map(asset => {
              return AssetRow(asset);
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
