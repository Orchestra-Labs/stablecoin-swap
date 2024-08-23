import waves2 from '@/assets/images/waves-test.svg';
import { useState } from 'react';

export const SwapSection = () => {
  const [sendAddress, setSendAddress] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSendAddress(event.target.value);
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
              <select className="w-full mb-4 p-2 border rounded text-black">
                <option>Send Option 1</option>
                <option>Send Option 2</option>
              </select>
              <input
                type="text"
                placeholder="Wallet Address"
                className="w-full mb-4 p-2 border rounded text-black"
                onInput={handleInputChange}
              />
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              {/* Swap Button */}
              <button className="bg-black py-3 px-6 rounded-lg font-semibold border border-green-700 hover:bg-green-600 transition">
                Initiate Swap
              </button>
            </div>

            {/* Swap Box 2 */}
            <div className="border border-gray-300 bg-black rounded-lg p-6 w-1/2">
              <select className="w-full mb-4 p-2 border rounded text-black">
                <option>Receive Option 1</option>
                <option>Receive Option 2</option>
              </select>
              <input
                type="text"
                placeholder={sendAddress || 'Wallet Address'}
                className="w-full mb-4 p-2 border rounded text-black"
                id="receiveAddress"
                readOnly
              />
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
