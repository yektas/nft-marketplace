import type { NextPage } from "next";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import * as animationData from "../animations/wings.json";
import axios from "axios";
import NFTCard from "../components/NFTCard";
import { getMarketContract, getTokenContract } from "./api/blockchainService";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
  isClickToPauseDisabled: true,
};

export type MarketItem = {
  price: string;
  name: string;
  description: string;
  image: string;
  owner: string;
  seller: string;
  isSold?: boolean;
  tokenId: number;
  itemId: number;
};
const Home: NextPage = () => {
  const [NFTs, setNFTs] = useState<MarketItem[] | undefined>([]);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const data = await getMarketContract().getAllMarketItems();
    const items = await Promise.all(
      data.map(async (nft) => {
        const tokenURI = await getTokenContract().tokenURI(nft.tokenId);
        const metadata = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`);
        const price = ethers.utils.formatUnits(nft.price.toString(), "ether");
        return {
          name: metadata.data.name,
          image: `https://ipfs.io/ipfs/${metadata.data.image}`,
          description: metadata.data.description,
          seller: nft.seller,
          owner: nft.owner,
          tokenId: nft.tokenId.toNumber(),
          itemId: nft.itemId.toNumber(),
          price: price.toString(),
        } as MarketItem;
      })
    );
    setNFTs(items);
  }
  return (
    <>
      <div className="grid items-center grid-cols-1 gap-8 hero-wrapper md:grid-cols-12">
        <div className="col-span-6 hero-text">
          <h1 className="max-w-xl text-4xl font-medium leading-tight text-white md:text-5xl">
            Best NFTs are here!
          </h1>

          <hr className="w-1/4 h-1 mt-8 bg-orange-500 border-orange-500 rounded-full " />
          <p className="mt-8 text-base font-medium leading-relaxed text-gray-200 ">
            You can find your favorite NFTs with good prices
          </p>
          <div className="flex justify-center mt-10 space-x-5 get-app md:justify-start">
            <button className="w-1/5 py-2 rounded-md bg-primary text-md">Shop Now</button>
          </div>
        </div>

        <div className="max-w-lg col-span-6">
          <Lottie options={defaultOptions} />
        </div>
      </div>

      <div className="container mx-auto mt-4 space-y-10">
        <h1 className="text-3xl prose-2xl text-white">NTFs</h1>
        <div className="pb-2 bg-gray-900 border-t-2 border-gray-700"></div>
        <div className="grid grid-cols-3 gap-10 ">
          {NFTs && NFTs.length > 0 ? (
            NFTs.map((nft: MarketItem) => <NFTCard nft={nft} />)
          ) : (
            <div>No NFTs in marketplace</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
