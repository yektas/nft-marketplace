import React, { useCallback, useEffect, useState } from "react";
import Web3Modal from "web3modal";

import { create } from "ipfs-http-client";

import { useSpinner } from "../components/common/SpinnerContext";

import { Loader } from "../components/common/Loader";
import { ethers } from "ethers";
import { getMarketContract, getTokenContract } from "./api/blockchainService";
import { useRouter } from "next/router";
import { MarketItemStructOutput } from "../../hardhat/typechain-types/Marketplace";
import { convertMarketItemStruct2MarketItem, convertMarketItemStructs2MarketItems } from "../utils";
import NFTCard from "../components/NFTCard";
import { MarketItem } from ".";
import useSWR from "swr";

interface Props {}

//const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });

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
