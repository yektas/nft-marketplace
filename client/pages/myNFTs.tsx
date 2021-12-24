import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { useSpinner } from "../components/common/SpinnerContext";
import { ethers } from "ethers";
import { getMarketContract } from "./api/blockchainService";
import { convertMarketItemStructs2MarketItems } from "../utils";
import NFTCard from "../components/NFTCard";
import { MarketItem } from ".";
import NFTCard2 from "../components/NFTCard";

interface Props {}

function MyNFTs(props: Props) {
  const { showSpinner, hideSpinner } = useSpinner();
  const [nfts, setNFTs] = useState<MarketItem[]>();
  useEffect(() => {
    showSpinner();
    fetchMyNFTs();
  }, []);

  async function fetchMyNFTs() {
    console.log("Trying to fetch ....");
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = getMarketContract(signer);

    const marketNFTs = await marketContract.getMyNFTs();
    const myNFTs = await convertMarketItemStructs2MarketItems(marketNFTs);
    setNFTs(myNFTs);
    hideSpinner();
  }

  return (
    <div className="container mx-auto mt-10 space-y-10">
      <h1 className="text-3xl prose-2xl text-white">My NFTs</h1>
      <div className="pb-2 bg-gray-900 border-t-2 border-gray-700"></div>
      <div className="grid grid-cols-3 gap-10 ">
        {nfts && nfts.length > 0 ? (
          nfts.map((nft: MarketItem) => <NFTCard key={nft.itemId} nft={nft} />)
        ) : (
          <div>You don't have a NFT</div>
        )}
      </div>
    </div>
  );
}

export default MyNFTs;
