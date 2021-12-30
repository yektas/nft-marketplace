import { ethers } from "ethers";
import { HeraCollection } from "../../../hardhat/typechain-types/HeraCollection";
import { Marketplace } from "../../../hardhat/typechain-types/Marketplace";
import { marketAddress, nftAddress } from "../../config";
import NFT from "../../../hardhat/artifacts/contracts/HeraCollection.sol/HeraCollection.json";
import Market from "../../../hardhat/artifacts/contracts/Marketplace.sol/Marketplace.json";

export const rpcProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_ROPSTEN_URL
);

export function getMarketContract(signer?: any) {
  let provider = rpcProvider;
  if (signer) {
    provider = signer;
  }
  return new ethers.Contract(marketAddress, Market.abi, provider) as Marketplace;
}

export function getTokenContract(signer?: any) {
  let provider = rpcProvider;
  if (signer) {
    provider = signer;
  }
  return new ethers.Contract(nftAddress, NFT.abi, provider) as HeraCollection;
}
