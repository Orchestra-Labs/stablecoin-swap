import { useWalletAssets } from "@/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { useChain } from "@cosmos-kit/react";
import { defaultChainName } from "@/constants";
import { Table, TableBody, TableCell, TableRow } from "@/components/Table";

const AssetRow = (asset: {
    denom: string;
    amount: string;
    isIbc: boolean;
}) => {
    return <TableRow>
        <TableCell className="font-medium">{asset.denom}</TableCell>
        <TableCell>{asset.amount}</TableCell>
        <TableCell>{asset.isIbc ? "ibc" : "Native Token"}</TableCell>
    </TableRow>
};


export const WalletInfoContainer = () => {
    const { username } = useChain(defaultChainName);
    const { data: assets } = useWalletAssets();
    
    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Wallet {username}</CardTitle>
                <CardDescription>Your wallet</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        {assets.map(asset => {
                            return AssetRow(asset);
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
};