<p align="center">
  <a href="https://polyplace.vercel.app/">
    <img src="/assets/logo02.png" alt="Alt text logo" title="Polyplace" width="100px" height="100px">
  </a>
</p>

# Polyplace

An open decentralized NFT Marketplace built with Solidity and Next.js, powered by Polygon Technologies. It basically is an open platform where users can mint and trade their own NFTs.


## Table of Contents

- [The Project](#the-project)
- [Developers](#developers)
- [Resources](#resources)


## The Project

An open platform where users can mint their own NFTs and list them on a Marketplace or buy NFTs from others. It includes:

- A smart contract which represents a collection of NFTs by following the ERC-721 standard.
- A smart contract which represents the NFT Marketplace and contains all the logic to make offers, execute offers...
- A Next.js front-end application as a user interface.

`NFTMarketplace` Polygon(Mumbai Testnet) smart contract address:

https://mumbai.polygonscan.com/address/0xF5f6B924332C350E3Fcd3A50Fc94db822f0B760f

### Demo video

https://www.youtube.com/watch?v=kVIb7MGJ53k&t=36s

### Project details

Users can access the application via web-browser, and must have the Metamask wallet installed. The interface, built with Next.js, relies on the ethers.js library to communicate with the smart contracts through Metamask. This means that the data reflected on the front-end application is fetched from the Polygon blockchain. Each action performed by the user (mint an NFT, sell NFT, buy NFT...) creates a transaction on Polygon, which will require Metamask confirmation and a small fee, and this transaction will permanently modify the state of the NFTMarketplace smart contracts. On top of it, user's NFT Metadata will be uploaded to the IPFS, generating a hash which will be permanently recorded on the blockchain to prove ownership.

### Features

Users can perform the following actions on the NFT Marketplace:

#### Mint

Input a name, description and upload a file (image) to mint an NFT. Once minted, a representation of this NFT will be displayed in the marketplace and it will be owned by its creator. This is open for everyone, meaning everyone can participate in this NFT creation through this platform. 

#### Buy NFT

A user can buy NFTs which someone else offered. This will require paying the requested price and a small fee.

#### Sell NFT

Users can sell their NFT by specifying its price (in MATIC). If someone fulfills this offer, then the NFT and its ownership is transferred to the new owner.

### Smart Contract Visualization

Below you can view the current's smart contract functions (and its interactions).

<p align="center">
<img src="/assets/NftViz.png" alt="SCV" title="Smart Contract Visualization">
</p>


## Developers

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher): https://nodejs.org/
- **npm** or **yarn**: Comes with Node.js
- **Git**: https://git-scm.com/
- **MetaMask** browser extension: https://metamask.io/

### Quick Start Guide

Follow these steps to get the project running on your local machine:

#### 1. Clone the Repository

```bash
git clone https://github.com/chrisstef/polyplace.git
cd polyplace
```

#### 2. Install Dependencies

```bash
npm install
```

This will install all necessary packages including Next.js, Hardhat, ethers.js, and other dependencies.

#### 3. Configure Environment Variables

Create a `.env.local` file in the project root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add the following configuration:

```bash
# ========================================
# IPFS Configuration (Required for image upload)
# ========================================

# Option 1: Pinata (Recommended)
# Get your free API key at https://www.pinata.cloud/
PINATA_JWT=your_pinata_jwt_token_here

# Option 2: NFT.Storage (Alternative)
# Get your free API key at https://nft.storage/
# NFT_STORAGE_API_KEY=your_nft_storage_api_key_here

# ========================================
# Blockchain Configuration
# ========================================

# Ethereum RPC Endpoint (Sepolia Testnet)
# Get your free API key at https://www.alchemy.com/ or https://infura.io/
NEXT_PUBLIC_API_KEY=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

# NFT Marketplace Contract Address (will be set after deployment)
NEXT_PUBLIC_MARKET_ADDRESS=0x_your_contract_address_after_deployment

# Etherscan API Key (Optional, for contract verification)
# Get it at https://etherscan.io/myapikey
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

#### 4. Get IPFS API Credentials

**Option A: Pinata (Recommended)**

1. Visit https://www.pinata.cloud/ and sign up for a free account
2. Go to **API Keys** → **New Key**
3. Enable permissions: `pinFileToIPFS` and `pinJSONToIPFS`
4. Copy the **JWT** token
5. Paste it in `.env.local` as `PINATA_JWT`

**Option B: NFT.Storage**

1. Visit https://nft.storage/ and sign up
2. Create a new API key
3. Copy the key and paste it in `.env.local` as `NFT_STORAGE_API_KEY`

#### 5. Get Blockchain RPC Endpoint

**Using Alchemy (Recommended)**

1. Visit https://www.alchemy.com/ and sign up
2. Create a new app:
   - Chain: **Ethereum**
   - Network: **Sepolia** (testnet)
3. Copy the **HTTPS** endpoint URL
4. Paste it in `.env.local` as `NEXT_PUBLIC_API_KEY`

**Using Infura**

1. Visit https://infura.io/ and sign up
2. Create a new project (Ethereum)
3. Copy the Sepolia endpoint URL
4. Paste it in `.env.local`

#### 6. Connect MetaMask to Sepolia Testnet

1. Open MetaMask extension
2. Click network dropdown → **Add Network** → **Add network manually**
3. Enter the following details:
   - **Network Name**: Sepolia Test Network
   - **RPC URL**: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`
   - **Chain ID**: `11155111`
   - **Currency Symbol**: `ETH`
   - **Block Explorer**: `https://sepolia.etherscan.io`
4. Click **Save**

Or simply visit https://chainlist.org/ and search for "Sepolia" to add it automatically.

#### 7. Get Test ETH (Sepolia)

You need test ETH to deploy contracts and create NFTs:

1. Copy your MetaMask wallet address
2. Visit one of these faucets:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia
   - https://faucet.quicknode.com/ethereum/sepolia
3. Paste your address and request test ETH

#### 8. Deploy Smart Contract (Local Development)

For local development, deploy to Hardhat's local blockchain:

```bash
# Start local Hardhat node (in a separate terminal)
npx hardhat node

# Deploy contract to local network (in another terminal)
npx hardhat run scripts/deploy.js --network localhost
```

**Important**: Copy the deployed contract address and update `NEXT_PUBLIC_MARKET_ADDRESS` in `.env.local`.

Also, comment out the RPC URL in `NFTContext.js` line 154 to use the local network:

```javascript
// const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_API_KEY);
const provider = new ethers.providers.JsonRpcProvider(); // Use local network
```

#### 9. Run the Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

#### 10. Test the Application

1. Open http://localhost:3000 in your browser
2. Click **Connect Wallet** and select your MetaMask account
3. Go to **Create NFT** page
4. Upload an image, fill in details, and create your first NFT
5. Check the **Home** page to see your NFT listed

### Deployment to Production

#### Deploy Smart Contract to Sepolia Testnet

1. Create a `.secret` file in the project root:

```bash
echo "your_metamask_private_key_without_0x_prefix" > .secret
```

**⚠️ Security Warning**: Never commit `.secret` file to Git. It's already in `.gitignore`.

**How to get your private key**:
- Open MetaMask → Account Details → Export Private Key
- Enter password and copy the key (remove `0x` prefix)

2. Ensure your wallet has Sepolia test ETH

3. Deploy the contract:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

4. Copy the deployed contract address from the output:

```
NFTMarketplace deployed to: 0x1234567890abcdef1234567890abcdef12345678
```

5. Update `.env.local`:

```bash
NEXT_PUBLIC_MARKET_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

6. (Optional) Verify contract on Etherscan:

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
```

#### Deploy Frontend to Vercel

1. Push your code to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Visit https://vercel.com/ and sign in with GitHub

3. Click **Add New** → **Project**

4. Import your repository

5. Configure environment variables in Vercel:
   - `PINATA_JWT`
   - `NEXT_PUBLIC_API_KEY`
   - `NEXT_PUBLIC_MARKET_ADDRESS`
   - `ETHERSCAN_API_KEY` (optional)

6. Click **Deploy**

7. Your app will be live at `https://your-project.vercel.app`

### Install & Run in Docker Environment

Before you begin, you'll need to have Docker installed on your machine. If you haven't already installed it, you can follow the installation instructions for your operating system on the official Docker website: https://docs.docker.com/get-docker/

To run the app in a Docker environment, follow these steps:

- Clone the repository to your local machine.
- Navigate to the root directory of the project in your terminal.
- Run the following command:

```sh
docker-compose up --force-recreate
```

The `docker-compose up --force-recreate` command starts the container defined in the `docker-compose.yml` file. The `--force-recreate` flag forces recreation of containers even if their configuration appears to be unchanged. This is useful when you want to make sure you are running the latest version of the container.

This command will start the container and map port `3000` on the container to port `3000` on your local machine. You can access the app by opening http://localhost:3000 in your web browser.

To stop the container, use `Ctrl + C` in your terminal and run the following command:

```sh
docker-compose down
```

### Run with Makefile (Optional)

`Makefile` provides convenient shortcuts for common tasks(docker instructions in our case). It is a way of automating software building procedure and other complex tasks with dependencies. Make sure you have `Makefile` installed and proceed with the following commands:

```shell
## Cleans, builds and runs the dapp on the DEVELOPMENT environment
make run-dev
```

```shell
## Cleans & recreates everything on the DEVELOPMENT environment
make recreate-dev
```

```shell
## Cleans the dapp from the DEVELOPMENT environment
make clean-dev
```

To see the list of all the available commands:

```shell
make help
```

That's it! You now have the `Next.js` app running in a Docker container. You can make changes to the app by modifying the files in the pages directory, and the changes will be automatically reflected in the running container.

### Troubleshooting

#### Image Upload Issues

**Problem**: "Failed to upload file to IPFS"

**Solution**:
1. Check that `PINATA_JWT` is correctly set in `.env.local`
2. Verify your Pinata API key has `pinFileToIPFS` permission
3. Check browser console for detailed error messages
4. Restart the development server after changing environment variables

#### Page Shows Black Screen

**Problem**: Homepage or other pages showing blank/black screen

**Solution**:
1. Check browser console for errors
2. Ensure `NEXT_PUBLIC_MARKET_ADDRESS` is set correctly
3. Verify the contract is deployed and accessible
4. Check that `next.config.js` includes all IPFS gateway domains:
   ```javascript
   images: {
     domains: [
       'gateway.pinata.cloud',
       'ipfs.io',
       'nftstorage.link',
     ],
   }
   ```

#### Contract Deployment Fails

**Problem**: "insufficient funds" error when deploying

**Solution**:
1. Check your wallet has enough Sepolia test ETH
2. Visit a faucet to get more test ETH
3. Verify you're connected to the correct network

#### MetaMask Connection Issues

**Problem**: "Please install MetaMask" or connection fails

**Solution**:
1. Install MetaMask browser extension
2. Ensure MetaMask is unlocked
3. Switch to the correct network (Sepolia for testnet)
4. Refresh the page after connecting

#### "My NFTs" Page is Empty

**Problem**: NFTs don't show up in "My NFTs" page

**Solution**:
1. This is expected behavior - when you create an NFT, it's automatically listed for sale
2. Check "Listed NFTs" page instead to see your created NFTs
3. After someone buys your NFT, it will appear in their "My NFTs" page
4. To see owned NFTs, you need to purchase NFTs from the marketplace

### Smart Contract Development

For advanced users who want to modify the smart contract:

1. Initialize Hardhat (if starting from scratch):
```bash
npx hardhat
```

2. Compile the smart contract after making changes:
```bash
npx hardhat compile
```

3. Run tests (if available):
```bash
npx hardhat test
```

4. Deploy to local network:
```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy
npx hardhat run scripts/deploy.js --network localhost
```

5. After deployment, update the contract address in `.env.local`

For more information, see the official Hardhat documentation: https://hardhat.org/hardhat-runner/docs/getting-started


### Tech stack

- `Solidity`
- `Next.js`
- `hardhat`
- `ethers.js`
- `node.js`
- `Metamask`
- `IPFS`
- `Infura`
- `Alchemy`

### Future Ideas

- Clear deploy on Polygon Mainnet. 
- Auction features.
- Bulk upload of NFTs as collections.
- Creator details page.


## Resources

- [polygon.technology](https://polygon.technology/)
- [Solidity](https://docs.soliditylang.org/en/v0.8.15/)
- [node.js](https://nodejs.org/)
- [ethers.js](https://docs.ethers.io/v5/)
- [next.js](https://nextjs.org/)
- [IPFS](https://ipfs.io/)
- [Infura](https://infura.io/)
- [Alchemy](https://www.alchemy.com/)
- [Vercel](https://vercel.com/docs)
