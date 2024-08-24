import { useState, useEffect } from 'react';
import waves2 from '@/assets/images/waves-test.svg';
import { getAssets } from './hooks/getAssets';
import { connectKeplr } from './utils/keplrUtils';
import { fetchWalletAssets } from './hooks';
import { Asset } from './types';

export const SwapSection = () => {
  const rpcUrl = 'https://symphony-api.kleomedes.network';
  const [sendAddress, setSendAddress] = useState('');
  const [selectedReceiveAsset, setSelectedReceiveAsset] = useState('');
  const [selectedSendAsset, setSelectedSendAsset] = useState('');
  const [noteAmount, setNoteAmount] = useState('');
  const [walletAssets, setWalletAssets] = useState<Asset[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const assets = getAssets(rpcUrl);

  useEffect(() => {
    const initializeKeplr = async () => {
      try {
        const signer = await connectKeplr('symphony-testnet-3');
        if (signer) {
          const accounts = await signer.getAccounts();
          const walletAddress = accounts[0].address;
          setSendAddress(walletAddress);

          const data = await fetchWalletAssets(rpcUrl, walletAddress);
          setWalletAssets(data?.assets ?? []);
        }
      } catch (error) {
        console.error('Failed to connect to Keplr:', error);
      }
    };

    initializeKeplr();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendAddress(event.target.value);
  };

  const handleNoteAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNoteAmount(event.target.value);
    calculateReceiveAmount(event.target.value, selectedReceiveAsset);
  };

  const handleSendAssetChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedAsset = event.target.value;
    setSelectedSendAsset(selectedAsset);

    const asset = walletAssets.find(a => a.denom === selectedAsset);
    if (asset?.isIbc) {
      setErrorMessage('Invalid Asset: Cannot swap IBC tokens.');
      setReceiveAmount(''); // Clear the receive amount if there's an error
    } else {
      setErrorMessage('');
      calculateReceiveAmount(noteAmount, selectedReceiveAsset);
    }
  };

  const handleReceiveAssetChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedAsset = event.target.value;
    setSelectedReceiveAsset(selectedAsset);
    calculateReceiveAmount(noteAmount, selectedAsset);
  };

  const calculateReceiveAmount = (noteAmount: string, receiveAsset: string) => {
    if (!receiveAsset || !noteAmount) {
      console.log('no receiving asset or no note amount');

      setReceiveAmount('');
      return '';
    }
    const exchangeRate = assets.find(a => a.denom === receiveAsset)?.amount;
    if (!exchangeRate) {
      console.log('no exchange rate');

      setReceiveAmount('');
      return '';
    }
    const amount = (parseFloat(noteAmount) / parseFloat(exchangeRate)).toFixed(
      6,
    );
    console.log('expected receive amount:', amount);
    setReceiveAmount(amount);
    return amount;
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute bg-hero-blur-circle blur-[180px] w-[372px] h-[372px] rounded-full top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 transition-size duration-500" />
      <div className="flex justify-center items-center min-h-[inherit] relative z-[1] px-25px md:px-6">
        <div className="flex flex-col max-w-[882px] text-center items-center gap-4 mt-[-50%] md:-mt-40 xl:-mt-[120px]">
          <h1 className="font-semibold text-white text-h4 md:text-h2/[56px] xl:text-display2 mt-12">
            Discover truly decentralized real-world assets
          </h1>

          <div className="min-h-[24px]">
            <p className="text-error">{errorMessage}</p>{' '}
          </div>

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
                {(walletAssets ?? []).map(asset => (
                  <option key={asset.denom} value={asset.denom}>
                    {asset.denom}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Amount of NOTE"
                className="w-full mb-4 p-2 border rounded text-black"
                value={noteAmount}
                onChange={handleNoteAmountChange}
              />
              <input
                type="text"
                placeholder="Wallet Address"
                className="w-full mb-4 p-2 border rounded text-black"
                value={sendAddress}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              {/* Swap Button */}
              <button
                className="bg-black py-3 px-6 rounded-lg font-semibold border border-green-700 hover:bg-green-600 transition"
                onClick={() => {
                  if (selectedReceiveAsset && noteAmount) {
                    console.log(
                      `Swapping ${noteAmount} NOTE for ${receiveAmount} ${selectedReceiveAsset}`,
                    );
                    // Here you would typically call a function to perform the swap
                  } else {
                    alert('Please enter NOTE amount and select receive asset');
                  }
                }}
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
              />
              {selectedReceiveAsset && (
                <p className="text-white">
                  Exchange rate:{' '}
                  {assets.find(a => a.denom === selectedReceiveAsset)?.amount}{' '}
                  note per {selectedReceiveAsset}
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
