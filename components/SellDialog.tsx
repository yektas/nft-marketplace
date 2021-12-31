import { useState, Fragment, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ethers } from "ethers";
import { getMarketContract, getTokenContract } from "../pages/api/blockchainService";
import { BlockchainContext } from "../context/BlockchainContext";

interface Props {
  open: boolean;
  onClose: () => void;
  itemId: number;
}

export const SellDialog = ({ open, itemId, onClose }: Props) => {
  const { getProvider } = useContext(BlockchainContext);

  const [price, setPrice] = useState<string | undefined>();

  async function sellNFT(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!price || (price && Number(price) <= 0)) {
      alert("Enter a valid price");
      return;
    }
    const provider = await getProvider();
    const signer = provider.getSigner();

    const nftContract = getTokenContract(signer);

    const marketContract = getMarketContract(signer);
    const listingCommision = await marketContract.getListingCommision();

    const transaction = await marketContract.createMarketItem(
      nftContract.address,
      itemId.toString(),
      ethers.utils.parseEther(price!),
      {
        value: listingCommision.toString(),
      }
    );

    console.log("transaction ", transaction);

    const tx = await transaction.wait();

    console.log("tx ", tx);
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto " onClose={onClose}>
        <form onSubmit={sellNFT} className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 transition bg-black opacity-70" />

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-8 my-8 overflow-hidden text-left align-middle transition-all transform shadow-homogen bg-background rounded-2xl">
              <Dialog.Title as="h2" className="text-2xl font-medium leading-6 text-white">
                Sell NFT
              </Dialog.Title>
              <div className="w-full h-0.5 my-4 bg-gray-500 rounded-full"></div>

              <div className="relative mt-8 rounded-md shadow-sm">
                <label htmlFor="price" className="block mb-4 font-medium text-gray-300 text-md">
                  Price
                </label>
                <input
                  required
                  type="number"
                  id="price"
                  name="price"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  className="block w-full h-12 pr-20 bg-[#282c36] border-none rounded-lg  focus:ring-primary text-lg font-inter"
                  placeholder="0.1"
                  step=".1"
                />
                <div className="absolute inset-y-0 right-0 flex items-center h-12 mt-10">
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 ml-3 font-semibold rounded-r-lg pointer-events-none bg-primary">
                    ETH
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <button
                  type="submit"
                  className="block w-full py-2 font-semibold rounded-full bg-primary text-md"
                >
                  Sell
                </button>
              </div>
            </div>
          </Transition.Child>
        </form>
      </Dialog>
    </Transition>
  );
};
