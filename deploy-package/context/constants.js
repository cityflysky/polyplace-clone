import marketAbi from './NFTMarketplace.json';

const defaultMarketAddress = '0xF5f6B924332C350E3Fcd3A50Fc94db822f0B760f';

export const MarketAddress = process.env.NEXT_PUBLIC_MARKET_ADDRESS || defaultMarketAddress;
export const MarketAddressABI = marketAbi.abi;
