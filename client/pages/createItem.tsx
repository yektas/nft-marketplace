import React, { useCallback, useState } from "react";
import { useSpinner } from "../components/common/SpinnerContext";

import { MarketItem } from "../pages";

interface Props {}

function CreateItem(props: Props) {
  const [inputs, setInputs] = useState<Partial<MarketItem>>({
    name: "",
    description: "",
    image: "",
  });
  const { showSpinner, hideSpinner } = useSpinner();

  const handleChange = useCallback(
    ({ target }) =>
      setInputs((_state) => {
        return {
          ..._state,
          [target.name]: target.value,
        };
      }),
    []
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showSpinner();
    hideSpinner();
  };

  return (
    <div className="w-1/2 ">
      <h1 className="text-2xl font-medium text-white">Create an NFT</h1>
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="space-y-4 ">
          <div>
            <label htmlFor="name" className="block font-medium text-gray-500 text-md">
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
                className="block w-full h-10 bg-gray-800 border-none rounded-lg focus:ring-orange-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="about" className="block font-medium text-gray-500 text-md">
              About
            </label>
            <div className="mt-1">
              <textarea
                id="about"
                required
                name="description"
                onChange={handleChange}
                value={inputs.description}
                className="block w-full h-24 mt-1 bg-gray-800 border-none rounded-lg shadow-sm focus:ring-orange-500 sm:text-sm"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Brief description for your profile. URLs are hyperlinked.
            </p>
          </div>

          <div>
            <label htmlFor="image" className="block font-medium text-gray-500 text-md">
              Image URL
            </label>
            <div className="mt-1">
              <input
                required
                type="text"
                id="image"
                name="image"
                onChange={handleChange}
                value={inputs.image}
                className="block w-full h-10 bg-gray-800 border-none rounded-lg focus:ring-orange-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="relative w-1/2 rounded-md shadow-sm">
            <label htmlFor="price" className="block font-medium text-gray-500 text-md">
              Price
            </label>
            <input
              required
              type="number"
              id="price"
              name="price"
              onChange={handleChange}
              value={inputs.price}
              className="block w-full h-10 pr-16 bg-gray-800 border-none rounded-lg focus:ring-orange-500 sm:text-sm"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 flex items-center h-10 mt-6">
              <div className="absolute inset-y-0 right-0 flex items-center px-4 ml-3 font-medium rounded-r-lg pointer-events-none bg-primary">
                ETH
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button type="submit" className="w-1/5 py-2 rounded-full bg-primary text-md">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateItem;
