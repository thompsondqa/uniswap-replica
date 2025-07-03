import React, { useEffect, useState } from 'react';
import TokenModal from './components/TokenModal';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { getTokenBalance } from './utils/getTokenBalance';
import { ethers } from 'ethers';
import { WETH_ABI, TOKENS } from './utils/constants';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('from'); // 'from' or 'to'
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromBalance, setFromBalance] = useState(null);
  const [toBalance, setToBalance] = useState(null);

  const { authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const provider = embeddedWallet?.getEthersProvider?.();
  const address = embeddedWallet?.address;

  // Fetch balances
  useEffect(() => {
    if (fromToken && address && provider) {
      getTokenBalance(fromToken, address, provider).then(setFromBalance);
    } else {
      setFromBalance(null);
    }
    if (toToken && address && provider) {
      getTokenBalance(toToken, address, provider).then(setToBalance);
    } else {
      setToBalance(null);
    }
  }, [fromToken, toToken, address, provider]);

  // Dummy conversion logic (1:1 for demo)
  useEffect(() => {
    setToAmount(fromAmount);
  }, [fromAmount, fromToken, toToken]);

  // Swap tokens
  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // Handle token selection from modal
  const handleSelectToken = (token) => {
    if (modalType === 'from') {
      setFromToken(token);
      // Prevent selecting the same token for both
      if (token.symbol === toToken.symbol) {
        const alt = TOKENS.find(t => t.symbol !== token.symbol);
        setToToken(alt);
      }
    } else {
      setToToken(token);
      if (token.symbol === fromToken.symbol) {
        const alt = TOKENS.find(t => t.symbol !== token.symbol);
        setFromToken(alt);
      }
    }
    setShowModal(false);
  };

  // Swap action (dummy)
  const handleSwap = async () => {
    if (!authenticated) {
      login();
      return;
    }
    alert(`Swapping ${fromAmount} ${fromToken.symbol} to ${toToken.symbol} (demo only)`);
  };

  return (
    <div className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center p-6">
      {/* Header */}
      <header className="flex items-center gap-2 mb-10">
        <img src="https://app.uniswap.org/favicon.ico" alt="Logo" className="w-10 h-10 rounded-full" />
        <h1 className="text-3xl font-bold text-white tracking-tight">Swap anytime, anywhere.</h1>
      </header>

      {/* Connect/Disconnect Wallet Button */}
      <button
        onClick={() => (authenticated ? logout() : login())}
        className="absolute top-6 right-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-2xl shadow transition"
      >
        {authenticated ? 'Disconnect Wallet' : 'Connect Wallet'}
      </button>

      {/* Swap Box */}
      <div className="w-full max-w-md mx-auto">
        <div className="rounded-3xl bg-[#18181b] border border-[#232336] shadow-2xl p-0">
          {/* Sell Panel */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Sell</span>
              {authenticated && (
                <span className="text-xs text-gray-500">
                  Balance: <span className="font-semibold">{fromBalance ?? '--'}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={e => setFromAmount(e.target.value)}
                className="flex-1 bg-transparent text-3xl text-white font-bold outline-none px-2"
                style={{ minWidth: 0 }}
              />
              <button
                onClick={() => { setModalType('from'); setShowModal(true); }}
                className="flex items-center gap-2 bg-[#232336] hover:bg-[#2d2f36] text-white px-4 py-2 rounded-xl font-semibold border border-white/10 shadow transition"
              >
                <span>{fromToken.symbol}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">${(fromAmount * 2500).toLocaleString(undefined, {maximumFractionDigits:2})}</div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center -my-2">
            <button
              onClick={handleSwapTokens}
              className="bg-[#232336] border-4 border-[#18181b] rounded-full p-2 shadow-lg hover:bg-[#2d2f36] transition"
              style={{ zIndex: 2 }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4m0 0l3 3m-3-3l3-3" />
              </svg>
            </button>
          </div>

          {/* Buy Panel */}
          <div className="p-6 pt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">Buy</span>
              {authenticated && (
                <span className="text-xs text-gray-500">
                  Balance: <span className="font-semibold">{toBalance ?? '--'}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="0.0"
                value={toAmount}
                onChange={e => setToAmount(e.target.value)}
                className="flex-1 bg-transparent text-3xl text-white font-bold outline-none px-2"
                disabled
                style={{ minWidth: 0 }}
              />
              <button
                onClick={() => { setModalType('to'); setShowModal(true); }}
                className="flex items-center gap-2 bg-[#232336] hover:bg-[#2d2f36] text-white px-4 py-2 rounded-xl font-semibold border border-white/10 shadow transition"
              >
                <span>{toToken.symbol}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">${(toAmount * 2500).toLocaleString(undefined, {maximumFractionDigits:2})}</div>
          </div>

          {/* Bottom Button */}
          <div className="p-6 pt-2">
            {!authenticated ? (
              <button
                onClick={login}
                className="w-full bg-gradient-to-r from-[#FF5B99] to-[#6C47FF] text-white font-bold py-3 rounded-2xl shadow hover:opacity-90 transition"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={handleSwap}
                className="w-full bg-gradient-to-r from-[#FF5B99] to-[#6C47FF] text-white font-bold py-3 rounded-2xl shadow hover:opacity-90 transition"
                disabled={!fromAmount || !fromToken || !toToken}
              >
                Get started
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Token Modal */}
      <TokenModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleSelectToken}
      />
    </div>
  );
}
