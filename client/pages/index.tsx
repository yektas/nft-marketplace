import type { NextPage } from "next";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";

import { nftAddress, marketAddress } from "../config";

import NFT from "../../hardhat/artifacts/contracts/HeraCollection.sol/HeraCollection.json";
import Market from "../../hardhat/artifacts/contracts/Marketplace.sol/Marketplace.json";
import type { HeraCollection } from "../../hardhat/typechain-types/HeraCollection";
import type { Marketplace } from "../../hardhat/typechain-types/Marketplace";
import axios from "axios";

export type MarketItem = {
  price: string;
  name: string;
  description: string;
  image: string;
  owner: string;
  seller: string;
  tokenId: number;
};
const Home: NextPage = () => {
  const [NFTs, setNFTs] = useState<MarketItem[] | undefined>([]);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider();
    console.log(provider);
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider) as HeraCollection;
    const marketContract = new ethers.Contract(marketAddress, Market.abi, provider) as Marketplace;

    const data = await marketContract.getAllMarketItems();

    const items = await Promise.all(
      data.map(async (nft) => {
        const tokenURI = await tokenContract.tokenURI(nft.tokenId);
        const metadata = await axios.get(tokenURI);
        const price = ethers.utils.formatUnits(nft.price.toString(), "ether");
        return {
          name: metadata.data.name,
          image: metadata.data.image,
          description: metadata.data.description,
          seller: nft.seller,
          owner: nft.owner,
          tokenId: nft.tokenId.toNumber(),
          price: price,
        } as MarketItem;
      })
    );
    setNFTs(items);
    console.log(items);
  }
  return (
    <div>
      <h1>Home</h1>

      {NFTs && NFTs.length > 0 ? (
        NFTs.map((item) => (
          <>
            <p>{item.tokenId}</p>
            <p>{item.name}</p>
            <p>{item.description}</p>
            <p>{item.image}</p>
            <p>{item.owner}</p>
            <p>{item.seller}</p>
            <p>{item.price}</p>
          </>
        ))
      ) : (
        <div>No items in marketplace</div>
      )}
    </div>
  );
};

export default Home;
