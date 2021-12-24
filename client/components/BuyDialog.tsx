import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "./common/Button";

interface Props {
  open: boolean;
  onClose: () => void;
  price: string;
  currentBalance: number;
  onBuy: () => void;
}

export const BuyDialog = ({ open, onClose, currentBalance, price, onBuy }: Props) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-aut" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

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
            <div className="inline-block w-full max-w-md p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-900 shadow-xl rounded-2xl">
              <Dialog.Title as="h2" className="text-2xl font-medium leading-6 text-white">
                Place a Bid
              </Dialog.Title>
              <div className="mt-4">
                <p className="text-gray-500 text-md">
                  Price{" "}
                  <span className="float-right font-semibold text-white font-inter">
                    {price} ETH
                  </span>
                </p>
              </div>
              <div className="mt-4">
                <p className="text-gray-500 text-md">
                  Your balance
                  <span className="float-right font-semibold text-white font-inter">
                    {currentBalance} ETH
                  </span>
                </p>
              </div>
              <div className="mt-4">
                <p className="text-gray-500 text-md">
                  Total bid amount
                  <span className="float-right font-semibold text-white font-inter">5 ETH</span>
                </p>
              </div>
              <div className="flex justify-center mt-8">
                <Button onClick={() => onBuy()}>Buy</Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
