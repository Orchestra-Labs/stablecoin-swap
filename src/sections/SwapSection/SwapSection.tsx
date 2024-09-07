import React, { useState, useEffect } from 'react';
import { useChain } from '@cosmos-kit/react';

import waves2 from '@/assets/images/waves-test.svg';
import { defaultChainName } from '@/constants';

import { useOracleAssets } from '@/hooks/useOracleAssets';
import { useSwapTx } from '@/hooks/useSwapTx';
import { useWalletAssets } from '@/hooks/useWalletAssets';
import { useExchangeRate } from '@/hooks/useExchangeRate';

export const SwapSection: React.FC = () => {
  const [selectedReceiveAsset, setSelectedReceiveAsset] = useState('');
  const [selectedSendAsset, setSelectedSendAsset] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [sendAmount, setSendAmount] = useState('');

  const { assets, isLoading: isLoadingAssets } = useOracleAssets();
  const { data: walletAssetsData, isLoading: isLoadingWalletAssets } = useWalletAssets();
  const walletAssets = walletAssetsData || [];
  const { address: sendAddress } = useChain(defaultChainName);
  const { swapTx } = useSwapTx(defaultChainName);

  const { exchangeRate, isLoading: isLoadingExchangeRate, error: exchangeRateError } = useExchangeRate(selectedSendAsset, selectedReceiveAsset);

  useEffect(() => {
    if (exchangeRate && sendAmount) {
      calculateReceiveAmount(sendAmount, exchangeRate);
    }
  }, [exchangeRate, sendAmount]);

  const handleSendAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value || '';
    setSendAmount(amount);
    if (exchangeRate) {
      calculateReceiveAmount(amount, exchangeRate);
    }
  };

  const handleSendAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAsset = event.target.value || '';
    setSelectedSendAsset(selectedAsset);

    const asset = walletAssets.find(a => a.denom === selectedAsset);
    if (asset?.isIbc) {
      setErrorMessage('Invalid Asset: Cannot swap IBC tokens.');
      setReceiveAmount('');
    } else {
      setErrorMessage('');
    }
  };

  const handleReceiveAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAsset = event.target.value || '';
    setSelectedReceiveAsset(selectedAsset);
  };

  const calculateReceiveAmount = (amount: string, rate: string) => {
    if (!rate || !amount) {
      setReceiveAmount('');
      return;
    }

    const calculatedAmount = (parseFloat(amount) * parseFloat(rate)).toFixed(6);
    setReceiveAmount(calculatedAmount);
  };

  const performSwap = async () => {
    if (!selectedReceiveAsset || !sendAmount || !selectedSendAsset) {
      alert('Please enter amount and select both send and receive assets');
      return;
    }

    try {
      await swapTx(
        sendAddress!,
        sendAddress!,
        { denom: selectedSendAsset, amount: sendAmount },
        selectedReceiveAsset,
      );
      // Handle successful swap (e.g., show success message, reset form, etc.)
    } catch (error) {
      console.error('Swap failed:', error);
      setErrorMessage('Swap failed. Please try again.');
    }
  };

  if (isLoadingAssets || isLoadingWalletAssets) {
    return <div>Loading assets...</div>;
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute bg-hero-blur-circle blur-[180px] w-[372px] h-[372px] rounded-full top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 transition-size duration-500" />
      <div className="flex justify-center items-center min-h-[inherit] relative z-[1] px-25px md:px-6">
        <div className="flex flex-col max-w-[882px] text-center items-center gap-4 mt-[-50%] md:-mt-40 xl:-mt-[120px]">
          <h1 className="font-semibold text-white text-h4 md:text-h2/[56px] xl:text-display2 mt-12">
            Discover truly decentralized real-world assets
          </h1>

          {errorMessage && (
            <div className="min-h-[24px]">
              <p className="text-error">{errorMessage}</p>
            </div>
          )}

          <div className="flex justify-between items-center w-full gap-8">
            {/* Swap Box 1 */}
            <div className="border border-gray-300 bg-black rounded-lg p-6 w-1/2">
              <h3 className="text-white mb-2">Send</h3>
              <select
                className="w-full mb-4 p-2 border rounded text-black"
                value={selectedSendAsset}
                onChange={handleSendAssetChange}
              >
                <option value="">Select send asset</option>
                {walletAssets.map(asset => (
                  <option key={asset.denom} value={asset.denom}>
                    {asset.denom}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Amount to send"
                className="w-full mb-4 p-2 border rounded text-black"
                value={sendAmount}
                onChange={handleSendAmountChange}
              />
              <input
                type="text"
                readOnly
                placeholder="Wallet Address"
                className="w-full mb-4 p-2 border rounded text-black"
                value={sendAddress || ''}
              />
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              <button
                className="bg-black py-3 px-6 rounded-lg font-semibold border border-green-700 hover:bg-green-600 transition"
                type="button"
                onClick={performSwap}
                disabled={!selectedSendAsset || !selectedReceiveAsset || !sendAmount}
              >
                Initiate Swap
              </button>
            </div>

            {/* Swap Box 2 */}
            <div className="border border-gray-300 bg-black rounded-lg p-6 w-1/2">
              <h3 className="text-white mb-2">Receive</h3>
              <select
                className="w-full mb-4 p-2 border rounded text-black"
                value={selectedReceiveAsset}
                onChange={handleReceiveAssetChange}
              >
                <option value="">Select receive asset</option>
                {assets.map(asset => (
                  <option key={asset.denom} value={asset.denom}>
                    {asset.denom}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={receiveAmount}
                className="w-full mb-4 p-2 border rounded text-black"
                readOnly
                placeholder="Receive amount"
              />
              <input
                type="text"
                placeholder={sendAddress || 'Wallet Address'}
                className="w-full mb-4 p-2 border rounded text-black"
                id="receiveAddress"
                readOnly
                value={sendAddress || ''}
              />
              {isLoadingExchangeRate && <p className="text-white">Loading exchange rate...</p>}
              {exchangeRateError && <p className="text-red-500">Error fetching exchange rate. Please try again.</p>}
              {exchangeRate && (
                <p className="text-white">
                  Exchange rate: 1 {selectedSendAsset} = {exchangeRate} {selectedReceiveAsset}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <img
        className="absolute bottom-0 w-full h-[291px]"
        src={waves2}
        alt="Waves"
      />
    </div>
  );
};