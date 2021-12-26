import React, { useState } from "react";
import Link from "next/link";
import { MarketItem } from "../pages";
import { ethers } from "ethers";
import Button from "./common/Button";
import { SellDialog } from "./SellDialog";

interface Props {
  nft: MarketItem;
}

const NFTCard = ({ nft }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-gray-200 cursor-pointer shadow-homogen bg-background rounded-2xl">
      <Link href={`/items/${nft.itemId}`}>
        <div className="p-4">
          <img src={nft.image} className="object-cover aspect-square rounded-2xl" />
        </div>
      </Link>
      <div className="px-4 pb-4">
        <div className="mt-2 mb-4 space-y-3 sm:pr-8">
          <h5 className="text-xl font-semibold ">{nft.name}</h5>
          <p className="text-lg text-gray-400">{nft.description}</p>
          <p className="inline-flex justify-between w-full text-2xl font-bold text-white font-inter">
            <span className="text-xl font-medium text-gray-400">Last price </span> {nft.price} ETH
          </p>
        </div>
        <div className="flex items-center space-x-2 justify-evenly">
          <Button onClick={() => setOpen(true)}>Sell</Button>
          <Link href={`/items/${nft.itemId}`}>
            <Button type="secondary">Details</Button>
          </Link>
        </div>
      </div>

      <SellDialog tokenId={nft.tokenId} open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default NFTCard;
