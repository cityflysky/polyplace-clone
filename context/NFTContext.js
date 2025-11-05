import React, { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import axios from 'axios';
import { Buffer } from 'buffer';

import { MarketAddress, MarketAddressABI } from './constants';

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
    const nftCurrency = 'ETH';
    const [currentAccount, setCurrentAccount] = useState('');
    const [isLoadingNFT, setIsLoadingNFT] = useState(false);

    const checkIfWalletIsConnect = async () => {
        if (!window.ethereum) return alert('Please install MetaMask.');

        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length) {
            setCurrentAccount(accounts[0]);
        } else {
            console.log('No accounts found');
        }
    };

    useEffect(() => {
        checkIfWalletIsConnect();
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) return alert('Please install MetaMask.');

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });

        setCurrentAccount(accounts[0]);
        window.location.reload();
    };

    const uploadToIPFS = async (file) => {
        try {
            console.log('Starting IPFS upload for file:', file.name);

            // Convert file to base64
            const arrayBuffer = await file.arrayBuffer();
            const base64Content = Buffer.from(arrayBuffer).toString('base64');

            // Call our API endpoint
            const response = await fetch('/api/ipfs-upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    base64: base64Content,
                    contentType: file.type,
                    fileName: file.name,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to upload to IPFS');
            }

            const { url } = await response.json();

            if (!url) {
                throw new Error('Upload failed: No URL returned from IPFS');
            }

            console.log('Upload to IPFS successful, URL:', url);
            return url;
        } catch (error) {
            console.error('Error uploading file to IPFS:', error);
            throw error;
        }
    };

    const createSale = async (url, formInputPrice, isReselling, id) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const price = ethers.utils.parseUnits(formInputPrice, 'ether');
        const contract = fetchContract(signer);
        const listingPrice = await contract.getListingPrice();

        const transaction = !isReselling
            ? await contract.createToken(url, price, {
                value: listingPrice.toString(),
            })
            : await contract.resellToken(id, price, {
                value: listingPrice.toString(),
            });

        setIsLoadingNFT(true);
        await transaction.wait();
    };

    const createNFT = async (formInput, fileUrl, router) => {
        const { name, description, price } = formInput;

        if (!name || !description || !price || !fileUrl) {
            throw new Error('Please fill in all fields');
        }

        const metadata = JSON.stringify({ name, description, image: fileUrl });

        try {
            console.log('Creating NFT with metadata:', metadata);

            // Upload metadata to IPFS
            const base64Metadata = Buffer.from(metadata).toString('base64');

            const response = await fetch('/api/ipfs-upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    base64: base64Metadata,
                    contentType: 'application/json',
                    fileName: `${name || 'metadata'}.json`,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to upload metadata to IPFS');
            }

            const { url } = await response.json();

            console.log('Created NFT metadata URL:', url);

            await createSale(url, price);

            router.push('/');
        } catch (error) {
            console.error('Error creating NFT:', error);
            throw error;
        }
    };

    const fetchNFTs = async () => {
        try {
            setIsLoadingNFT(false);
            const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_API_KEY);
            const contract = fetchContract(provider);

            console.log('Fetching market items from contract...');
            const data = await contract.fetchMarketItems();
            console.log('Found', data.length, 'items in marketplace');

            const items = await Promise.all(
                data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
                    try {
                        const tokenURI = await contract.tokenURI(tokenId);
                        console.log('Fetching metadata for token', tokenId.toString(), 'from', tokenURI);

                        const { data: { image, name, description } } = await axios.get(tokenURI);
                        const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

                        return {
                            price,
                            tokenId: tokenId.toNumber(),
                            seller,
                            owner,
                            image,
                            name,
                            description,
                            tokenURI,
                        };
                    } catch (error) {
                        console.error('Error fetching NFT metadata for token', tokenId.toString(), ':', error.message);
                        return null;
                    }
                }),
            );

            const validItems = items.filter((item) => item !== null);
            console.log('Successfully loaded', validItems.length, 'NFTs');
            return validItems;
        } catch (error) {
            console.error('Error fetching NFTs from contract:', error);
            // Return empty array instead of throwing
            return [];
        }
    };

    const fetchMyNFTsOrListedNFTs = async (type) => {
        try {
            setIsLoadingNFT(false);
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();

            const contract = fetchContract(signer);

            console.log('Fetching', type === 'fetchItemsListed' ? 'listed' : 'owned', 'NFTs...');
            const data = type === 'fetchItemsListed'
                ? await contract.fetchItemsListed()
                : await contract.fetchMyNFTs();

            console.log('Found', data.length, type === 'fetchItemsListed' ? 'listed' : 'owned', 'items');

            const items = await Promise.all(
                data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
                    try {
                        const tokenURI = await contract.tokenURI(tokenId);
                        console.log('Fetching metadata for token', tokenId.toString(), 'from', tokenURI);

                        const { data: { image, name, description } } = await axios.get(tokenURI);
                        const price = ethers.utils.formatUnits(
                            unformattedPrice.toString(),
                            'ether',
                        );

                        return {
                            price,
                            tokenId: tokenId.toNumber(),
                            seller,
                            owner,
                            image,
                            name,
                            description,
                            tokenURI,
                        };
                    } catch (error) {
                        console.error('Error fetching NFT metadata for token', tokenId.toString(), ':', error.message);
                        return null;
                    }
                }),
            );

            const validItems = items.filter((item) => item !== null);
            console.log('Successfully loaded', validItems.length, type === 'fetchItemsListed' ? 'listed' : 'owned', 'NFTs');
            return validItems;
        } catch (error) {
            console.error('Error fetching NFTs:', error);
            // Return empty array instead of throwing
            return [];
        }
    };

    return (
        <NFTContext.Provider
            value={{
                nftCurrency,
                currentAccount,
                connectWallet,
                uploadToIPFS,
                createNFT,
                fetchNFTs,
                fetchMyNFTsOrListedNFTs,
                setIsLoadingNFT,
                isLoadingNFT,
            }}
        >
            {children}
        </NFTContext.Provider>
    );
};

export default NFTProvider;
