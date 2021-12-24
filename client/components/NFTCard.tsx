import React from "react";
import Link from "next/link";
import { MarketItem } from "../pages";
import { ethers } from "ethers";

interface Props {
  nft: MarketItem;
}

const NFTCard = ({ nft }: Props) => {
  return (
    <div className="relative block text-gray-200 shadow-homogen bg-background rounded-2xl">
      <div className="p-4">
        <img src={nft.image} className="object-cover aspect-square rounded-2xl" />
      </div>
      <div className="px-4 pb-4">
        <div className="mt-2 mb-4 space-y-3 sm:pr-8">
          <h5 className="text-xl font-semibold ">{nft.name}</h5>
          <p className="text-gray-400">{nft.description}</p>
          <p className="text-2xl font-bold text-white font-inter">{nft.price} ETH</p>
        </div>
        <div className="flex items-center space-x-2 justify-evenly">
          <button className="flex items-center justify-center w-full py-4 leading-none rounded-full shadow-sm shadow-background bg-primary px-7">
            <span className="font-semibold text-white transition duration-200 ">Buy</span>
          </button>

          <Link href={`/items/${nft.itemId}`}>
            <button className="flex items-center justify-center w-full py-4 leading-none text-gray-400 border-2 border-gray-600 rounded-full shadow-xs shadow-background bg-background px-7">
              <span className="font-semibold transition duration-200">Details</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
