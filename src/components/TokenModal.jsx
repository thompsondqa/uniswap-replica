import React from 'react';
import { TOKENS } from '../utils/constants';

export default function TokenModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 w-96 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Select a token</h2>
        <ul className="space-y-2">
          {TOKENS.map((token) => (
            <li
              key={token.symbol}
              onClick={() => {
                onSelect(token);
                onClose();
              }}
              className="cursor-pointer flex items-center justify-between p-4 rounded-2xl bg-[#232336] hover:bg-[#2D2F36] transition"
            >
              <div>
                <div className="font-semibold text-white">{token.symbol}</div>
                <div className="text-xs text-gray-300">{token.name}</div>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gradient-to-r from-[#FF5B99] to-[#6C47FF] text-white font-semibold py-3 rounded-2xl shadow hover:opacity-90 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
