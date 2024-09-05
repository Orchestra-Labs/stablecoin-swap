import { useChain } from '@cosmos-kit/react';

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

const AssetRow = (asset: { denom: string; amount: string; isIbc: boolean }) => {
  const { denom, amount, isIbc } = asset;
  const amountNumber = parseInt(amount, 10);
  return (
    <TableRow>
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
  const { data: assets } = useWalletAssets();
  const { toast } = useToast();

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
          <div>{address}</div>
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
