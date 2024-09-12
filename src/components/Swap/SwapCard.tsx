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
  const prevValueRef = useRef<string>(''); // To store the previous input value

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

  // Helper function to remove all non-numeric characters (except decimal points)
  const stripNonNumerics = (value: string) => {
    return value.replace(/[^\d.]/g, ''); // Remove everything except digits and the decimal point
  };

  // Handle user input change, strip non-numerics, add the new character, and reformat
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const caretPosition = event.target.selectionStart || 0;

    // Remove commas and non-numeric characters for accurate processing
    const rawValue = stripNonNumerics(inputValue);

    // Update local state temporarily without formatting
    setLocalInputValue(rawValue);

    const numericValue = parseFloat(rawValue);
    if (!isNaN(numericValue)) {
      onAmountValueChange(numericValue); // Propagate the numeric value to the parent
    } else {
      onAmountValueChange(0);
    }

    // Reapply formatting and reposition the caret
    setTimeout(() => {
      if (inputRef.current) {
        const previousRawValue = stripNonNumerics(prevValueRef.current);
        const formattedValue = formatNumberWithCommas(numericValue || 0);
        const previousFormattedValue = formatNumberWithCommas(
          parseFloat(previousRawValue),
        );
        setLocalInputValue(formattedValue); // Update the input with the formatted value

        // Compare the previous value with the new one to determine if it's an addition or removal
        let characterWasAdded = false;
        console.log(
          'input',
          inputValue,
          'raw',
          rawValue,
          'previous value',
          previousRawValue,
        );
        // console.log(
        //   'input length',
        //   rawValue.length,
        //   'previous value length',
        //   previousRawValue.length,
        // );
        if (rawValue.length > previousRawValue.length) {
          // console.log('Addition detected:', rawValue[caretPosition - 1]);
          characterWasAdded = true;
        } else if (rawValue.length < previousRawValue.length) {
          // console.log('Removal detected:', previousRawValue[caretPosition - 1]);
          characterWasAdded = false;
        } else {
          // console.log('No change detected');
          characterWasAdded = false;
        }

        console.log('input', rawValue, 'position', caretPosition - 1);
        console.log(
          'formatted length',
          formattedValue.length,
          'raw length',
          rawValue.length,
          'previous raw length',
          previousRawValue.length,
          'previous formatted length',
          previousFormattedValue.length,
        );
        console.log('formatted', formattedValue, 'raw', rawValue);
        let newCaretPosition = caretPosition;
        if (characterWasAdded) {
          console.log('checking character addition scenarios');
          if (formattedValue.length - rawValue.length > 1) {
            newCaretPosition += 1;
            console.log('formatted greatly exceeds raw, adding 1 to index');
          } else if (
            rawValue.length > previousFormattedValue.length &&
            formattedValue.length !== rawValue.length
          ) {
            newCaretPosition += 1;
            console.log('raw exceeds formatted previous, adding 1 to index');
          }
        } else if (!characterWasAdded) {
          console.log('checking character removal scenarios');
          if (previousFormattedValue.length - formattedValue.length > 1) {
            newCaretPosition -= 1;
            console.log(
              'previous formatted greatly exceeds formatted, removing 1 from index',
            );
          } else if (formattedValue.length === previousRawValue.length) {
            console.log('formatted matches previous raw, taking no action');
          } else {
            console.log('raw is equal, taking no action');
          }
        }

        prevValueRef.current = inputValue;

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
          placeholder="0.0"
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
