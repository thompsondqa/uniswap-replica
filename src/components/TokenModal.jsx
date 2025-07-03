import React from 'react';
import { TOKENS } from '../utils/constants';

export default function TokenModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Select a token</h2>
        <ul>
          {TOKENS.map((token) => (
            <li
              key={token.symbol}
              onClick={() => {
                onSelect(token);
                onClose();
              }}
              className="cursor-pointer p-3 rounded hover:bg-gray-100"
            >
              <div className="font-semibold">{token.symbol}</div>
              <div className="text-sm text-gray-500">{token.name}</div>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="mt-4 w-full bg-red-500 text-white p-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
}
