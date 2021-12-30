import { ethers } from "ethers";
import axios from "axios";
import { create } from "ipfs-http-client";
import { MarketItemStructOutput } from "../hardhat/typechain-types/Marketplace";
import { getTokenContract } from "./pages/api/blockchainService";
import { MarketItem } from "./pages";

/** Uses `URL.createObjectURL` free returned ObjectURL with `URL.RevokeObjectURL` when done with it.
 *
 * @param {string} cid CID you want to retrieve
 * @param {string} mime mimetype of image (optional, but useful)
 * @returns ObjectURL
 */
export async function loadImgURL(cid: string, mime?: string) {
  const ipfs = create({ url: "https://ipfs.infura.io:5001/api/v0" });
  console.log(await ipfs.isOnline());
  if (cid == "" || cid == null || cid == undefined) {
    return;
  }

  for await (const file of ipfs.get(cid) as any) {
    const content = [];
    console.log("file ", file);

    if (file.content) {
      for await (const chunk of file.content) {
        content.push(chunk);
      }

      return URL.createObjectURL(new Blob(content, { type: mime }));
    }
  }
}

export function getEllipsisTxt(str: string, n = 4) {
  if (str) {
    return `${str.slice(0, n + 2)}...${str.slice(str.length - n)}`.toLowerCase();
  }
  return "";
}

export async function convertMarketItemStruct2MarketItem(item: MarketItemStructOutput) {
  const tokenURI = await getTokenContract().tokenURI(item.tokenId);
  const metadata = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`);
  return {
    name: metadata.data.name,
    image: `https://ipfs.io/ipfs/${metadata.data.image}`,
    description: metadata.data.description,
    seller: item.seller,
    owner: item.owner,
    tokenId: item.tokenId.toNumber(),
    itemId: item.itemId.toNumber(),
    price: item.price,
  } as MarketItem;
}

export async function convertMarketItemStructs2MarketItems(items: MarketItemStructOutput[]) {
  const marketItems: MarketItem[] = [];
  const contract = getTokenContract();

  for (let i = 0; i < items.length; i++) {
    const tokenURI = await contract.tokenURI(items[i].tokenId);
    const metadata = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`);
    marketItems.push({
      name: metadata.data.name,
      image: `https://ipfs.io/ipfs/${metadata.data.image}`,
      description: metadata.data.description,
      seller: items[i].seller,
      owner: items[i].owner,
      tokenId: items[i].tokenId.toNumber(),
      itemId: items[i].itemId.toNumber(),
      price: items[i].price,
    } as MarketItem);
  }

  return marketItems;
}

export function classNames(...classes: (false | null | undefined | string)[]) {
  return classes.filter(Boolean).join(" ");
}
