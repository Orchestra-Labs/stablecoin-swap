import { ChangeEvent, useEffect, useState } from 'react';
import { Asset } from '@/sections';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../Select';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Input } from '../Input';
import { CircleDollarSign } from 'lucide-react';

export type SwapCardProps = {
  title: string;
  selectPlaceholder: string;
  options: { [key: string]: { label: string; logo?: string } };
  amountValue: number;
  selectedAsset: Asset | null;
  onAssetValueChange: (value: string) => void;
  onAmountValueChange: (value: number) => void;
  address: string;
  amountInputEnabled?: boolean;
  addressInputEnabled?: boolean;
};

const Option = (props: { value: string; label: string; logo?: string }) => {
  const { value, label, logo } = props;

  return (
    <SelectItem key={value} value={value}>
      <div className="flex items-center gap-2">
        {logo ? (
          <img src={logo} alt={`${label} logo`} className="w-6 h-6" />
        ) : (
          <CircleDollarSign className="h-6 w-6" />
        )}
        <span>{label}</span>
      </div>
    </SelectItem>
  );
};

export const SwapCard = (props: SwapCardProps) => {
  const [localSelectedValue, setLocalSelectedValue] = useState<string>('');

  const {
    title,
    selectPlaceholder,
    options,
    amountValue,
    selectedAsset,
    onAssetValueChange,
    onAmountValueChange,
    address,
    addressInputEnabled = true,
  } = props;

  // Update the local selected value whenever the selectedAsset prop changes
  useEffect(() => {
    if (selectedAsset?.denom !== localSelectedValue) {
      setLocalSelectedValue(selectedAsset?.denom || '');
    }
  }, [selectedAsset, localSelectedValue]);

  // Disable amount input until an asset is selected
  const amountInputEnabled = !!localSelectedValue;

  // Use selectedAsset.exponent for maximumFractionDigits or default to 6
  const formattedAmount = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: selectedAsset?.exponent || 6,
  }).format(amountValue);

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value.replace(/,/g, '') || '0');
    onAmountValueChange(value);
  };

  return (
    <Card className="w-[380px] bg-black backdrop-blur-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Select
          value={localSelectedValue}
          onValueChange={(value: string) => {
            setLocalSelectedValue(value);
            onAssetValueChange(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={selectPlaceholder} />
          </SelectTrigger>
          <SelectContent className="bg-black backdrop-blur-xl">
            <SelectGroup>
              {Object.keys(options).map(option => (
                <Option
                  key={option}
                  value={option}
                  label={options[option].label}
                  logo={options[option].logo}
                />
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          lang="en"
          step="1"
          className="bg-black backdrop-blur-xl"
          type="text" // Text to allow displaying commas
          placeholder="amount"
          value={formattedAmount}
          disabled={!amountInputEnabled} // Disable input if no asset is selected
          onChange={handleAmountChange}
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
