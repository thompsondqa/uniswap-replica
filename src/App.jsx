import React, { useEffect, useState } from 'react';
import TokenModal from './components/TokenModal';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { getTokenBalance } from './utils/getTokenBalance';
import { ethers } from 'ethers';
import { WETH_ABI } from './utils/constants';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const provider = embeddedWallet?.getEthersProvider?.();

  const address = embeddedWallet?.address;

  useEffect(() => {
    if (selectedToken && address && provider) {
      getTokenBalance(selectedToken, address, provider).then(setBalance);
    } else {
      setBalance(null);
    }
  }, [selectedToken, address, provider]);

  const sendToken = async () => {
    if (!authenticated) {
      login();
      return;
    }
    const signer = provider.getSigner();
    const parsedAmount = ethers.utils.parseUnits(amount, selectedToken.decimals);

    if (selectedToken.symbol === 'ETH') {
      const tx = await signer.sendTransaction({
        to: recipient,
        value: parsedAmount,
      });
      await tx.wait();
    } else {
      const contract = new ethers.Contract(selectedToken.address, WETH_ABI, signer);
      const tx = await contract.transfer(recipient, parsedAmount);
      await tx.wait();
    }

    alert(`Sent ${amount} ${selectedToken.symbol}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D2F36] to-[#232336] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <header className="flex items-center gap-2 mb-10">
        <img src="https://app.uniswap.org/favicon.ico" alt="Logo" className="w-10 h-10 rounded-full" />
        <h1 className="text-3xl font-bold text-white tracking-tight">Rockstar Modal</h1>
      </header>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        <button
          onClick={() => (authenticated ? logout() : login())}
          className="mb-6 w-full bg-gradient-to-r from-[#6C47FF] to-[#FF5B99] text-white font-semibold px-6 py-3 rounded-2xl shadow hover:opacity-90 transition"
        >
          {authenticated ? 'Disconnect Wallet' : 'Connect Wallet'}
        </button>

        {/* Swap Box - Always visible */}
        <div className="w-full">
          <div className="bg-[#232336] rounded-2xl p-6 shadow-lg border border-white/10">
            {/* From Panel */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-300">From</span>
              {selectedToken && authenticated && (
                <span className="text-xs text-gray-400">
                  Balance: <span className="font-semibold">{balance}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-[#2D2F36] hover:bg-[#383a42] text-white px-4 py-2 rounded-xl font-semibold border border-white/10 shadow transition"
                disabled={!authenticated}
              >
                {selectedToken ? (
                  <>
                    {/* Optionally add a token logo here */}
                    <span>{selectedToken.symbol}</span>
                  </>
                ) : (
                  <>
                    <span>Select Token</span>
                  </>
                )}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="flex-1 bg-transparent text-2xl text-white font-bold outline-none px-2"
                style={{ minWidth: 0 }}
                disabled={!authenticated || !selectedToken}
              />
            </div>

            {/* To Panel */}
            <div className="flex items-center justify-between mt-6 mb-2">
              <span className="text-sm text-gray-300">To</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                placeholder="Recipient address"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                className="w-full bg-[#2D2F36] text-white border border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C47FF] transition"
                disabled={!authenticated}
              />
            </div>

            {/* Swap/Send Button */}
            <button
              onClick={sendToken}
              disabled={
                !authenticated ||
                !selectedToken ||
                !amount ||
                !recipient
              }
              className={`w-full mt-6 bg-gradient-to-r from-[#6C47FF] to-[#FF5B99] text-white font-bold py-3 rounded-2xl shadow hover:opacity-90 transition ${
                (!authenticated || !selectedToken || !amount || !recipient)
                  ? 'opacity-60 cursor-not-allowed'
                  : ''
              }`}
            >
              {!authenticated
                ? 'Connect Wallet to Swap'
                : selectedToken
                ? `Send ${selectedToken.symbol}`
                : 'Select Token'}
            </button>
          </div>
        </div>
      </div>

      <TokenModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={setSelectedToken}
      />
    </div>
  );
}
