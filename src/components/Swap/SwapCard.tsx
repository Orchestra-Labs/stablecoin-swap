import { ChangeEvent, useEffect, useState, useRef } from 'react';
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
  amountValue: number; // Passed amount from parent
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
  const [localInputValue, setLocalInputValue] = useState<string>(''); // Local input for temporary user value
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    title,
    selectPlaceholder,
    options,
    amountValue, // Passed value from the parent
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

  // Effect to update local input value whenever the parent updates amountValue
  useEffect(() => {
    if (!isNaN(amountValue)) {
      setLocalInputValue(formatNumberWithCommas(amountValue)); // Reflect the formatted amountValue from the parent
    }
  }, [amountValue]);

  // Disable amount input until an asset is selected
  const amountInputEnabled = !!localSelectedValue;

  // Function to format the number with commas
  const formatNumberWithCommas = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: selectedAsset?.exponent || 6,
    }).format(value);
  };

  // Regex to validate number input and restrict to selectedAsset.exponent decimal places
  const getRegexForDecimals = (exponent: number) => {
    return new RegExp(`^\\d*\\.?\\d{0,${exponent}}$`); // Allows digits and at most `exponent` decimals
  };

  // Handle user input change, use regex to limit decimals, format the value, and propagate to parent
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.replace(/,/g, ''); // Remove commas for parsing
    const regex = getRegexForDecimals(selectedAsset?.exponent ?? 6);

    if (regex.test(inputValue) || inputValue === '') {
      setLocalInputValue(event.target.value); // Keep the user input if it matches the regex
      const value = parseFloat(inputValue);

      if (!isNaN(value)) {
        onAmountValueChange(value); // Send the numeric value to the parent
      } else {
        onAmountValueChange(0); // Reset to 0 if the input is invalid
      }
    }
  };

  // Handle formatting the input when the user finishes typing (on blur)
  const handleBlur = () => {
    const value = parseFloat(localInputValue.replace(/,/g, ''));
    if (!isNaN(value)) {
      setLocalInputValue(formatNumberWithCommas(value)); // Format the input with commas on blur
    }
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
          ref={inputRef} // Reference to the input to control cursor position
          lang="en"
          step={selectedAsset?.exponent ?? 6}
          className="bg-black backdrop-blur-xl"
          type="text"
          placeholder="amount"
          value={localInputValue} // Display formatted input from local state
          disabled={!amountInputEnabled}
          onChange={handleAmountChange}
          onBlur={handleBlur} // Format the input when the user leaves the input field
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
