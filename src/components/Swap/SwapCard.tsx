import { ChangeEvent, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select/Select';

export type SwapCardProps = {
  title: string;
  selectPlaceholder: string;
  options: { [key: string]: string };
  amountValue: number;
  onAssetValueChange: (value: string) => void;
  onAmountValueChange: (value: number) => void;
  address: string;
  amountInputEnabled?: boolean;
  addressInputEnabled?: boolean;
};

const Option = (props: { value: string; label: string }) => {
  const { value, label } = props;
  return (
    <SelectItem key={value} value={value}>
      {label}
    </SelectItem>
  );
};

export const SwapCard = (props: SwapCardProps) => {
  const [selectedValue, setSelectedValue] = useState<string>('' as string);

  const {
    title,
    selectPlaceholder,
    options,
    amountValue,
    onAssetValueChange,
    onAmountValueChange,
    address,
    amountInputEnabled = true,
    addressInputEnabled = true,
  } = props;
  return (
    <Card className="w-[380px] bg-black backdrop-blur-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Select
          value={selectedValue}
          onValueChange={(value: string) => {
            setSelectedValue(value);
            onAssetValueChange(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={selectPlaceholder} />
          </SelectTrigger>
          <SelectContent className="bg-black backdrop-blur-xl">
            <SelectGroup>
              {Object.keys(options).map(option => (
                <Option key={option} value={option} label={options[option]} />
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          lang="en"
          step="1"
          className="bg-black backdrop-blur-xl"
          type="number"
          placeholder="amount"
          value={amountValue}
          disabled={!amountInputEnabled}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onAmountValueChange(parseFloat(event.target.value ?? '0'))
          }
        />
        <Input
          className="bg-black backdrop-blur-xl"
          value={address}
          disabled={!addressInputEnabled}
        />
      </CardContent>
    </Card>
  );
};
