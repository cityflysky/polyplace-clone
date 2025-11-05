const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');

const privateKey = fs.readFileSync('.secret').toString().trim();
const sepoliaUrl = process.env.SEPOLIA_RPC_URL || process.env.NEXT_PUBLIC_API_KEY || '';

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    matic: {
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [privateKey],
    },
    sepolia: {
      url: sepoliaUrl,
      accounts: [privateKey],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || '',
    },
  },
  solidity: '0.8.4',
};
