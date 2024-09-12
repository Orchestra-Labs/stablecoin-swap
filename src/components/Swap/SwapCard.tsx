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
  const [localInputValue, setLocalInputValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const prevValueRef = useRef<string>('');

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

  // Effect to update local input value whenever the parent updates amountValue
  useEffect(() => {
    if (!isNaN(amountValue) && amountValue !== null) {
      setLocalInputValue(formatNumberWithCommas(amountValue || 0));
    } else {
      setLocalInputValue('0.0');
    }
  }, [amountValue]);

  // Disable input until asset is selected
  const amountInputEnabled = !!localSelectedValue;

  // Format the number with commas
  const formatNumberWithCommas = (value: string | number): string => {
    const stringValue = String(value);
    const [integerPart, decimalPart] = stringValue.split('.') || ['', ''];
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ',',
    );

    return decimalPart !== undefined
      ? `${formattedIntegerPart}.${decimalPart}`
      : formattedIntegerPart;
  };

  // Helper function to remove all non-numeric characters (except decimal points)
  const stripNonNumerics = (value: string) => {
    return value.replace(/[^\d.]/g, '');
  };

  // Validate numberic input and restrict to selectedAsset.exponent decimal places
  const getRegexForDecimals = (exponent: number) => {
    return new RegExp(`^\\d*\\.?\\d{0,${exponent}}$`);
  };

  // Handle user input change, strip non-numerics, add the new character, and reformat
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const caretPosition = event.target.selectionStart || 0;
    const regex = getRegexForDecimals(selectedAsset?.exponent ?? 6);

    // Remove commas and non-numeric characters for accurate processing
    const rawValue = stripNonNumerics(inputValue);

    // Split the input into the integer and decimal parts
    const [integerPart, decimalPart] = rawValue.split('.');

    // Check if decimal part exceeds 6 digits and truncate if necessary
    let processedValue = rawValue;
    if (decimalPart && decimalPart.length > 6) {
      processedValue = `${integerPart}.${decimalPart.slice(0, 6)}`;
    }

    const numericValue = parseFloat(processedValue);
    if (!isNaN(numericValue) || !regex.test(inputValue) || inputValue === '') {
      onAmountValueChange(numericValue);
    } else {
      onAmountValueChange(0);
    }

    // Update the input with the formatted value
    const formattedValue = formatNumberWithCommas(processedValue || 0);
    setLocalInputValue(formattedValue);

    const previousRawValue = stripNonNumerics(prevValueRef.current);
    const previousFormattedValue = formatNumberWithCommas(
      parseFloat(previousRawValue),
    );

    // Reposition the caret
    setTimeout(() => {
      if (inputRef.current) {
        // Compare the previous value with the new one to determine if it's an addition or removal
        let characterWasAdded = false;

        if (rawValue.length > previousRawValue.length) {
          characterWasAdded = true;
        } else if (rawValue.length < previousRawValue.length) {
          characterWasAdded = false;
        } else {
          characterWasAdded = false;
        }

        let newCaretPosition = caretPosition;
        if (characterWasAdded) {
          if (formattedValue.length - rawValue.length > 1) {
            newCaretPosition += 1;
          } else if (
            rawValue.length > previousFormattedValue.length &&
            formattedValue.length !== rawValue.length
          ) {
            newCaretPosition += 1;
          }
        } else if (!characterWasAdded) {
          if (previousFormattedValue.length - formattedValue.length > 1) {
            newCaretPosition -= 1;
          } else if (formattedValue.length === previousRawValue.length) {
          }
        }

        prevValueRef.current = processedValue;

        // Ensure caret assignment happens after the DOM is updated
        setTimeout(() => {
          inputRef.current?.setSelectionRange(
            newCaretPosition,
            newCaretPosition,
          );
        }, 0);
      }
    }, 0);
  };

  // Handle formatting the input when the user finishes typing (on blur)
  const handleBlur = () => {
    const value = parseFloat(stripNonNumerics(localInputValue));

    if (!isNaN(value)) {
      setLocalInputValue(formatNumberWithCommas(value));
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
          ref={inputRef}
          lang="en"
          step={selectedAsset?.exponent ?? 6}
          className="bg-black backdrop-blur-xl"
          type="text"
          placeholder="0.0"
          value={localInputValue || '0.0'}
          disabled={!amountInputEnabled}
          onChange={handleAmountChange}
          onBlur={handleBlur}
        />
        <Input
          className="bg-black backdrop-blur-xl"
          value={address}
          disabled={!addressInputEnabled}
          onChange={() => {}}
        />
      </CardContent>
    </Card>
  );
};
