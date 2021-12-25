import React from "react";
import Link from "next/link";
import { MarketItem } from "../pages";
import { ethers } from "ethers";
import Button from "./common/Button";

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
          <p className="text-lg text-gray-400">{nft.description}</p>
          <p className="text-2xl font-bold text-white font-inter">{nft.price} ETH</p>
        </div>
        <div className="flex items-center space-x-2 justify-evenly">
          <Button>Buy</Button>

          <Link href={`/items/${nft.itemId}`}>
            <Button type="secondary">Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
