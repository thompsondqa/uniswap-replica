import { ethers } from 'ethers';
import { WETH_ABI } from './constants';

export const getTokenBalance = async (token, walletAddress, provider) => {
  if (token.symbol === 'ETH') {
    const balance = await provider.getBalance(walletAddress);
    return ethers.utils.formatEther(balance);
  } else {
    const contract = new ethers.Contract(token.address, WETH_ABI, provider);
    const balance = await contract.balanceOf(walletAddress);
    return ethers.utils.formatUnits(balance, token.decimals);
  }
};
