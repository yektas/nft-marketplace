import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSpinner } from "../../components/common/SpinnerContext";
import { MarketItem } from "..";
import { ethers } from "ethers";

import axios from "axios";
import { getMarketContract, getTokenContract } from "../api/blockchainService";
import { getEllipsisTxt } from "../../utils";
import { BuyDialog } from "../../components/BuyDialog";
import { GlowButton } from "../../components/common/GlowButton";

type Props = {};

const ItemDetail = ({}: Props) => {
  const { showSpinner, hideSpinner } = useSpinner();
  const [nft, setNFT] = useState<MarketItem>();
  const [owner, setOwner] = useState<string | undefined>();
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { itemId } = router.query;

    fetchMarketItem(itemId as string).then(async (tokenId: number) => {
      await setOwnerAddress(tokenId);
    });
  }, [router.isReady]);

  async function setOwnerAddress(tokenId: number) {
    const owner = await getTokenContract().ownerOf(tokenId);
    setOwner(owner);
  }

  async function fetchMarketItem(itemId: string) {
    showSpinner();
    const nft = await getMarketContract().getNFT(itemId);
    console.log("pure ", nft.price);
    const tokenURI = await getTokenContract().tokenURI(nft.tokenId.toString());
    const metadata = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`);

    setNFT({
      name: metadata.data.name,
      image: `https://ipfs.io/ipfs/${metadata.data.image}`,
      description: metadata.data.description,
      seller: nft.seller,
      owner: nft.owner,
      isSold: nft.isSold,
      tokenId: nft.tokenId.toNumber(),
      itemId: Number(itemId),
      price: nft.price,
    } as MarketItem);
    hideSpinner();
    return nft.tokenId.toNumber();
  }

  function isOwner() {
    if (nft) {
      return owner && owner == nft.owner;
    }
  }

  function renderNFT(nft: MarketItem) {
    const price = ethers.utils.formatUnits(nft.price.toString(), "ether");
    return (
      <div className="text-white mt-28">
        <div className="grid grid-cols-1 gap-10 pt-4 pb-12 space-y-10 md:gap-2 md:grid-cols-3">
          <div className="col-span-2 place-self-center">
            <figure className="flex justify-center px-4 ">
              <img
                src={nft.image}
                className="object-cover w-full rounded-lg shadow-lg md:w-2/3 aspect-square"
              />
            </figure>
          </div>

          <div className="h-full ">
            <div className="flex flex-col h-full ml-4">
              <h1 className="text-4xl font-semibold">
                {nft.name} - #{nft.itemId}
              </h1>
              <p className="mt-10 text-lg font-semibold leading-normal text-gray-400">
                {nft.description}
              </p>

              <div className="flex-1"></div>
              <div className="grid grid-cols-2">
                <div className="flex flex-col col-span-2 xl:col-span-1">
                  <label className="font-semibold text-gray-500 text-md">
                    {isOwner() ? "Owner" : "Seller"}
                  </label>
                  <p className="text-xl font-semibold lowercase font-poppins">
                    {owner && getEllipsisTxt(owner)}
                  </p>
                </div>
                <div className="flex flex-col col-span-2 xl:col-span-1">
                  <label className="font-semibold text-gray-500 text-md">Collection</label>
                  <p className="text-xl font-semibold ">BoredHeraClub</p>
                </div>
              </div>

              <div className="flex flex-col mt-2">
                <label className="font-semibold text-gray-500 text-md">
                  {isOwner() ? "Last Price" : "Price"}
                </label>
                <p className="text-xl font-bold text-white font-inter">
                  <img src="/eth.svg" className="inline w-5 h-5 filter brightness-300" /> {price}{" "}
                  ETH
                </p>
              </div>
              <div className="flex-1"></div>
              <GlowButton onClick={() => setOpen(true)}>
                {nft.isSold ? "Sell" : "Buy Now"}
              </GlowButton>
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
        </div>
      </div>
    );
  }

  return <div>{nft && renderNFT(nft)}</div>;
};

export default ItemDetail;
