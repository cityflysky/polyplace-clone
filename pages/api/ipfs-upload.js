import { Buffer } from 'buffer';
import FormData from 'form-data';
import axios from 'axios';

// Pinata API credentials - Get free at https://www.pinata.cloud/
const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

// NFT.Storage API Key - Alternative option
const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY;

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('=== IPFS Upload Request ===');
        console.log('PINATA_JWT available:', !!PINATA_JWT);
        console.log('PINATA_API_KEY available:', !!PINATA_API_KEY);
        console.log('PINATA_SECRET_KEY available:', !!PINATA_SECRET_KEY);
        console.log('NFT_STORAGE_API_KEY available:', !!NFT_STORAGE_API_KEY);

        const { base64, contentType = 'application/octet-stream', fileName = 'upload.bin' } = req.body || {};

        if (!base64) {
            return res.status(400).json({ error: 'Missing base64 payload' });
        }

        const contentBuffer = Buffer.from(base64, 'base64');
        console.log('File size:', contentBuffer.length, 'bytes');

        // Option 1: Use Pinata (recommended - most reliable)
        if (PINATA_JWT || (PINATA_API_KEY && PINATA_SECRET_KEY)) {
            console.log('Using Pinata with', PINATA_JWT ? 'JWT' : 'API Key/Secret');

            const formData = new FormData();
            formData.append('file', contentBuffer, {
                filename: fileName,
                contentType: contentType,
            });

            // Prepare headers - prefer JWT if available
            const headers = {
                ...formData.getHeaders(),
            };

            if (PINATA_JWT) {
                headers['Authorization'] = `Bearer ${PINATA_JWT}`;
                console.log('Using JWT authentication');
            } else {
                headers['pinata_api_key'] = PINATA_API_KEY;
                headers['pinata_secret_api_key'] = PINATA_SECRET_KEY;
                console.log('Using API Key/Secret authentication');
            }

            try {
                console.log('Sending request to Pinata...');
                const response = await axios.post(
                    'https://api.pinata.cloud/pinning/pinFileToIPFS',
                    formData,
                    {
                        headers,
                        maxContentLength: Infinity,
                        maxBodyLength: Infinity,
                    }
                );

                const cid = response.data.IpfsHash;
                const url = `https://gateway.pinata.cloud/ipfs/${cid}`;

                console.log('Successfully uploaded to Pinata:', { cid, url });

                return res.status(200).json({
                    url,
                    cid,
                    contentType,
                });
            } catch (pinataError) {
                console.error('Pinata upload failed:');
                console.error('Status:', pinataError.response?.status);
                console.error('Error data:', pinataError.response?.data);
                console.error('Error message:', pinataError.message);
                throw pinataError;
            }
        }

        // Option 2: Use NFT.Storage (alternative)
        if (NFT_STORAGE_API_KEY) {
            const formData = new FormData();
            formData.append('file', contentBuffer, {
                filename: fileName,
                contentType: contentType,
            });

            const response = await axios.post(
                'https://api.nft.storage/upload',
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        'Authorization': `Bearer ${NFT_STORAGE_API_KEY}`,
                    },
                    maxContentLength: Infinity,
                    maxBodyLength: Infinity,
                }
            );

            const cid = response.data.value.cid;
            const url = `https://nftstorage.link/ipfs/${cid}`;

            console.log('Successfully uploaded to NFT.Storage:', { cid, url });

            return res.status(200).json({
                url,
                cid,
                contentType,
            });
        }

        // No IPFS credentials configured
        return res.status(500).json({
            error: 'IPFS service not configured',
            details: 'Please set up Pinata or NFT.Storage API credentials. See .env.local for instructions.'
        });

    } catch (error) {
        console.error('Failed to upload to IPFS:', error.response?.data || error.message);
        return res.status(500).json({
            error: 'Failed to upload to IPFS',
            details: error.response?.data?.message || error.message
        });
    }
}
