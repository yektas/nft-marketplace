import type { NextPage } from "next";
import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";
import * as animationData from "../animations/wings.json";
import axios from "axios";
import NFTCard from "../components/NFTCard";
import { getMarketContract, getTokenContract } from "./api/blockchainService";
import { GlowButton } from "../components/common/GlowButton";

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

  const nftsRef = useRef(null);

  const executeScroll = () => nftsRef && nftsRef.current && nftsRef.current.scrollIntoView();

  return (
    <>
      <div className="grid h-screen grid-cols-1 md:items-center md:grid-cols-12">
        <div className="order-last col-span-6 md:order-first">
          <h1 className="max-w-xl text-4xl font-semibold leading-tight text-white md:text-5xl">
            Best NFTs are here!
          </h1>

          <h4 className="mt-8 text-lg font-medium leading-relaxed text-gray-200 ">
            You can find your favorite NFTs with good prices
          </h4>
          <GlowButton onClick={executeScroll}>Explore Now</GlowButton>
        </div>

        <div className="order-first max-w-lg col-span-6 md:order-last">
          <Lottie options={defaultOptions} />
        </div>
      </div>

      <section ref={nftsRef} className="container mx-auto mt-2 space-y-10 scroll-mt-28">
        <h1 className="text-4xl font-semibold text-center ">
          Latest <span className="text-primary">NTFs</span>
        </h1>
        <div className="grid grid-cols-3 gap-10 py-8">
          {NFTs && NFTs.length > 0 ? (
            NFTs.map((nft: MarketItem) => <NFTCard nft={nft} />)
          ) : (
            <div>No NFTs in marketplace</div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
