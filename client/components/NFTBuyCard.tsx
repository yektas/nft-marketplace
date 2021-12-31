import React, { useContext, useState } from "react";
import Link from "next/link";
import { MarketItem } from "../pages";
import { ethers } from "ethers";
import Button from "./common/Button";
import { BlockchainContext } from "../context/BlockchainContext";
import { BuyDialog } from "./BuyDialog";

interface Props {
  nft: MarketItem;
}

const NFTBuyCard = ({ nft }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative text-gray-200 shadow-homogen bg-background rounded-2xl">
      <span className="absolute z-10 inline-flex items-center px-3 text-sm font-semibold text-white rounded-full bg-primary right-2 top-2">
        # <span className="pl-1 text-xl">{nft.itemId}</span>
      </span>
      <Link href={`/items/${nft.itemId}`}>
        <div className="p-4 cursor-pointer">
          <img src={nft.image} className="object-cover aspect-square rounded-2xl" />
        </div>
      </Link>
      <div className="px-4 pb-4">
        <div className="mt-2 mb-4 space-y-3 sm:pr-8">
          <h5 className="text-xl font-semibold ">{nft.name}</h5>
          <p className="text-lg text-gray-400">{nft.description}</p>
          <p className="text-2xl font-bold text-white font-inter">
            {ethers.utils.formatEther(nft.price)} ETH
          </p>
        </div>
        <div className="flex items-center space-x-2 justify-evenly">
          <Button onClick={() => setOpen(true)}>Buy</Button>

          <Link href={`/items/${nft.itemId}`} passHref>
            <Button type="secondary">Details</Button>
          </Link>
        </div>
      </div>

      {open && (
        <BuyDialog
          open={open}
          onClose={() => setOpen(false)}
          price={nft.price}
          itemId={nft.itemId}
          onComplete={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default NFTBuyCard;
