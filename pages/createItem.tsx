import React, { useCallback, useContext, useEffect, useState } from "react";

import { create } from "ipfs-http-client";

import { useSpinner } from "../components/common/SpinnerContext";

import { MarketItem } from "../pages";
import { Loader } from "../components/common/Loader";
import { BigNumber, ethers } from "ethers";
import { getMarketContract, getTokenContract } from "./api/blockchainService";
import { useRouter } from "next/router";
import { BlockchainContext } from "../context/BlockchainContext";

interface Props {}

const client = create({ url: "https://ipfs.infura.io:5001/api/v0" });

function CreateItem(props: Props) {
  const router = useRouter();

  const { getProvider } = useContext(BlockchainContext);

  const [inputs, setInputs] = useState<Partial<MarketItem>>({
    name: "",
    description: "",
    image: "",
    price: BigNumber.from("0"),
  });
  const [preview, setPreview] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | undefined>();

  const { showSpinner, hideSpinner } = useSpinner();

  const fileSelectedHandler = async (event: any) => {
    if (!event.target.files || event.target.files.length === 0) {
      setImageFile(undefined);
      return;
    }
    setImageFile(event.target.files[0]);
  };

  useEffect(() => {
    if (!imageFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const fileUploadHandler = async () => {
    setLoading(true);
    let imageCID = null;
    try {
      const added = await client.add(imageFile!);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setPreview(url);
      imageCID = added.path;
      setLoading(false);
    } catch (error) {
      console.log("Error uploading file: ", error);
      setLoading(false);
    }
    return imageCID;
  };

  const handleChange = useCallback(
    ({ target }) =>
      setInputs((_state) => {
        if (target.name === "price") {
          return {
            ..._state,
            [target.name]: ethers.utils.parseEther(target.value),
          };
        } else {
          return {
            ..._state,
            [target.name]: target.value,
          };
        }
      }),
    []
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const imageCID = await fileUploadHandler();
    showSpinner();

    const tokenURI = JSON.stringify({
      name: inputs.name,
      description: inputs.description,
      image: imageCID,
    });
    const added = await client.add(tokenURI);
    await createMarketSale(added.path);

    hideSpinner();
    router.push("/");
  };

  async function createMarketSale(tokenURI: string) {
    const provider = await getProvider();
    const signer = provider.getSigner();

    const tokenContract = getTokenContract(signer);
    let transaction = await tokenContract.createBoredHera(tokenURI);
    let tx = await transaction.wait();

    const tokenId = tx!.events![0].args![2];
    //const price = ethers.utils.parseUnits(inputs.price!, "ether");

    const marketContract = getMarketContract(signer);
    const listingCommision = await marketContract.getListingCommision();

    transaction = await marketContract.createMarketItem(
      tokenContract.address,
      tokenId.toString(),
      inputs.price!,
      {
        value: listingCommision.toString(),
      }
    );

    tx = await transaction.wait();
    console.log(tx);
  }

  return (
    <div className="w-full md:w-1/2 mt-28">
      <h1 className="text-2xl font-medium text-white">Create an NFT</h1>
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block font-medium text-gray-300 text-md">
              Name
            </label>
            <div className="mt-1">
              <input
                required
                type="text"
                id="name"
                name="name"
                onChange={handleChange}
                value={inputs.name}
                className="block w-full h-10 bg-[#282c36] border-none rounded-lg focus:ring-primary sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block font-medium text-gray-300 text-md">
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                required
                name="description"
                onChange={handleChange}
                value={inputs.description}
                className="block w-full h-24 mt-1 border-none rounded-lg shadow-sm bg-[#282c36] focus:ring-primary sm:text-sm"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">Brief description for your NFT.</p>
          </div>

          <div>
            <label className="block font-medium text-gray-300 text-md">NFT Image</label>

            <div className="flex justify-center w-1/2 p-3 mt-4 border-2 border-gray-500 border-dashed rounded-md h-1/2 hover:cursor-pointer hover:border-gray-200 ">
              {loading ? (
                <Loader />
              ) : preview ? (
                <>
                  <img className="object-cover" src={preview} />
                </>
              ) : (
                <div className="w-full text-center">
                  <div className="flex justify-center text-sm text-gray-500">
                    <label
                      htmlFor="image"
                      className="relative w-full h-full p-2 font-medium rounded-md cursor-pointer hover:text-gray-400 focus-within:outline-none "
                    >
                      {" "}
                      <svg
                        className="w-12 h-12 mx-auto "
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="pointer-none">
                        Drag and drop the image here <br /> or select an image from your computer
                      </p>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        onChange={fileSelectedHandler}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
            {preview && (
              <div className="mt-4">
                <label
                  htmlFor="image"
                  className="p-3 text-sm text-white bg-gray-700 rounded-md cursor-pointer"
                >
                  Change Image
                  <input
                    id="image"
                    name="image"
                    type="file"
                    onChange={fileSelectedHandler}
                    className="sr-only"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="relative w-1/2 rounded-md shadow-sm">
            <label htmlFor="price" className="block font-medium text-gray-300 text-md">
              Price
            </label>
            <input
              required
              type="number"
              id="price"
              name="price"
              onChange={handleChange}
              value={ethers.utils.formatEther(inputs.price!)}
              className="block w-full h-10 pr-16 bg-[#282c36] border-none rounded-lg focus:ring-primary sm:text-sm"
              placeholder="0.5"
              step=".1"
            />
            <div className="absolute inset-y-0 right-0 flex items-center h-10 mt-6">
              <div className="absolute inset-y-0 right-0 flex items-center px-4 ml-3 font-semibold rounded-r-lg pointer-events-none bg-primary">
                ETH
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className="w-1/5 py-2 font-semibold rounded-full bg-primary text-md"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateItem;
