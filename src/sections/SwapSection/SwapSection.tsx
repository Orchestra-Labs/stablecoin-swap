import { useState, useEffect } from 'react';
import waves2 from '@/assets/images/waves-test.svg';
import { useAssets } from './hooks/useAssets';
import { connectKeplr } from './utils/keplrUtils'; // Adjust the path as needed

export const SwapSection = () => {
  const [sendAddress, setSendAddress] = useState('');
  const [selectedReceiveAsset, setSelectedReceiveAsset] = useState('');
  const [noteAmount, setNoteAmount] = useState('');
  const assets = useAssets();

  useEffect(() => {
    // Connect to Keplr when the component mounts
    connectKeplr('cosmoshub-4')
      .then(client => {
        if (client) {
          console.log('Keplr connected successfully.');
        }
      })
      .catch(error => {
        console.error('Failed to connect to Keplr:', error);
      });
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendAddress(event.target.value);
  };

  const handleNoteAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNoteAmount(event.target.value);
  };

  const calculateReceiveAmount = (): string => {
    if (!selectedReceiveAsset || !noteAmount) return '';
    const exchangeRate = assets.find(
      a => a.denom === selectedReceiveAsset,
    )?.amount;
    if (!exchangeRate) return '';
    return (parseFloat(noteAmount) / parseFloat(exchangeRate)).toFixed(6);
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute bg-hero-blur-circle blur-[180px] w-[372px] h-[372px] rounded-full top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 transition-size duration-500" />
      <div className="flex justify-center items-center min-h-[inherit] relative z-[1] px-25px md:px-6">
        <div className="flex flex-col max-w-[882px] text-center items-center gap-4 mt-[-50%] md:-mt-40 xl:-mt-[120px]">
          <h1 className="font-semibold text-white text-h4 md:text-h2/[56px] xl:text-display2">
            Discover truly decentralized real-world assets
          </h1>

          <div className="flex justify-between items-center w-full gap-8 mt-8">
            {/* Swap Box 1 */}
            <div className="border border-gray-300 bg-black rounded-lg p-6 w-1/2">
              <h3 className="text-white mb-2">Send NOTE</h3>
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
                onInput={handleInputChange}
              />
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              {/* Swap Button */}
              <button
                className="bg-black py-3 px-6 rounded-lg font-semibold border border-green-700 hover:bg-green-600 transition"
                onClick={() => {
                  if (selectedReceiveAsset && noteAmount) {
                    console.log(
                      `Swapping ${noteAmount} NOTE for ${calculateReceiveAmount()} ${selectedReceiveAsset}`,
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
              <select
                className="w-full mb-4 p-2 border rounded text-black"
                value={selectedReceiveAsset}
                onChange={e => setSelectedReceiveAsset(e.target.value)}
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
                value={calculateReceiveAmount()}
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
