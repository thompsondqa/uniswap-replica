export const TOKENS = [
  {
    symbol: 'ETH',
    name: 'Sepolia Ether',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0xdd13E55209Fd76AfE204dBda4007C227904f0a81',
    decimals: 18,
  },
];

export const WETH_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
];
