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
    }
  }, [selectedToken, address]);

  const sendToken = async () => {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6">Uniswap-style Modal</h1>

      <button
        onClick={() => (authenticated ? logout() : login())}
        className="mb-4 bg-indigo-600 text-white px-6 py-2 rounded-full"
      >
        {authenticated ? 'Disconnect Wallet' : 'Connect Wallet'}
      </button>

      {authenticated && (
        <>
          <div className="flex gap-4 items-center mb-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-500 text-white px-4 py-2 rounded-full"
            >
              {selectedToken ? selectedToken.symbol : 'Select Token'}
            </button>

            {selectedToken && (
              <div className="text-sm text-gray-700">
                Balance: <span className="font-semibold">{balance}</span>
              </div>
            )}
          </div>

          {selectedToken && (
            <div className="space-y-3 w-full max-w-sm">
              <input
                placeholder="Recipient address"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                placeholder="Amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <button
                onClick={sendToken}
                className="w-full bg-green-600 text-white p-2 rounded"
              >
                Send {selectedToken.symbol}
              </button>
            </div>
          )}
        </>
      )}

      <TokenModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={setSelectedToken}
      />
    </div>
  );
}
