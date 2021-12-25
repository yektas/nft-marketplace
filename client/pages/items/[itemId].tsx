import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Check } from "../../components/common/Check";
import { Copy } from "../../components/common/Copy";
//import { BiddingDialog } from "../../components/BiddingDialog";
import clsx from "clsx";
import { useSpinner } from "../../components/common/SpinnerContext";
import { MarketItem } from "..";
import { ethers } from "ethers";

import axios from "axios";
import { getMarketContract, getTokenContract } from "../api/blockchainService";
import { getEllipsisTxt } from "../../utils";
import Web3Modal from "web3modal";
import Button from "../../components/common/Button";
import { BuyDialog } from "../../components/BuyDialog";
import { GlowButton } from "../../components/common/GlowButton";

type Props = {};

const ItemDetail = ({}: Props) => {
  const { showSpinner, hideSpinner } = useSpinner();
  const [nft, setNFT] = useState<MarketItem>();
  const [currentOwner, setCurrentOwner] = useState();
  const [balance, setBalance] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { itemId } = router.query;

    fetchMarketItem(itemId as string).then(async (itemId) => {
      //await setProductOwner(itemId);
      await setAccountBalance();
    });
  }, [router.isReady]);

  /*   async function setProductOwner(itemId: number) {
    const productOwner = await contract!.methods.getProductOwner(productId).call();
    setCurrentOwner(productOwner);
  } */

  const isOwnedByAccount = () => {
    return true;
    //return nft?.isSold && currentOwner == wallet.account;
  };

  async function setAccountBalance() {
    //setBalance(Number(Number(ethers.utils.parseUnits(wallet.balance, "ether")).toFixed(2)));
    setBalance(Number(Number(ethers.utils.parseUnits("1", "ether")).toFixed(2)));
  }

  async function onBuy() {
    if (nft) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      showSpinner();
      const transaction = await getMarketContract(signer).createMarketSale(
        getTokenContract().address,
        nft.itemId.toString(),
        { value: ethers.utils.parseUnits(nft.price, "ether") }
      );
      const tx = await transaction.wait();
      hideSpinner();
    }
  }

  async function fetchMarketItem(itemId: string) {
    showSpinner();
    const nft = await getMarketContract().getNFT(itemId);
    console.log("NFT by itemId ", nft);
    const tokenURI = await getTokenContract().tokenURI(nft.tokenId.toString());
    const metadata = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`);

    const price = ethers.utils.formatUnits(nft.price.toString(), "ether");
    setNFT({
      name: metadata.data.name,
      image: `https://ipfs.io/ipfs/${metadata.data.image}`,
      description: metadata.data.description,
      seller: nft.seller,
      owner: nft.owner,
      tokenId: nft.tokenId.toNumber(),
      itemId: Number(itemId),
      price: price.toString(),
    } as MarketItem);
    hideSpinner();
  }

  function renderNFT(nft: MarketItem) {
    return (
      <div className="text-white mt-28">
        <div className="grid grid-cols-3 pt-4 pb-12">
          <div className="col-span-2 place-self-center">
            <figure className="flex justify-center px-4 ">
              <img
                src={nft.image}
                className="object-cover w-2/3 rounded-lg shadow-lg aspect-square"
              />
            </figure>
          </div>

          <div className="h-full ">
            <div className="flex flex-col h-full ml-4">
              <h1 className="text-4xl font-semibold">{nft.name}</h1>
              <p className="mt-10 text-lg font-semibold leading-loose text-gray-400">
                {nft.description}
              </p>

              <div className="flex-1"></div>
              <div className="grid grid-cols-2">
                <div className="flex flex-col col-span-2 xl:col-span-1">
                  <label className="font-bold text-gray-500 text-md">Seller</label>
                  <p className="text-xl font-semibold ">
                    {getEllipsisTxt("0x00000000000000000000")}
                  </p>
                </div>
                <div className="flex flex-col col-span-2 xl:col-span-1">
                  <label className="font-bold text-gray-500 text-md">Collection</label>
                  <p className="text-xl font-semibold ">BoredHeraClub</p>
                </div>
              </div>

              {/*  <div className="flex justify-between mt-10 ">
                <div className="flex flex-col ">
                  <p className="pb-2 font-medium text-gray-500 text-md ">Seller</p>
                  <p className="flex font-semibold text-white ">
                    {currentOwner && currentOwner}
                    <span className="inline-block">
                      {isCopied ? (
                        <Check />
                      ) : (
                        <Copy onClick={() => setIsCopied(true)} address={currentOwner!} />
                      )}
                    </span>
                  </p>
                </div>
              </div> */}

              <div className="flex flex-col mt-2">
                <label className="font-bold text-gray-500 text-md">Price</label>
                <p className="text-xl font-bold text-white font-inter">{nft.price} ETH</p>
              </div>
              <div className="flex-1"></div>
              <GlowButton onClick={() => setOpen(true)}>
                {nft.isSold ? "Sold" : "Buy Now"}
              </GlowButton>
            </div>

            <BuyDialog
              open={open}
              onClose={() => setOpen(false)}
              price={nft.price}
              currentBalance={balance}
              onBuy={() => onBuy()}
            />
          </div>
        </div>
      </div>
    );
  }

  return <div>{nft && renderNFT(nft)}</div>;
};

export default ItemDetail;
