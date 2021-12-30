import { useEffect, useState, createContext, FC } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3Modal";

export type AppContextProps = {
  connectedAccount: string | undefined;
  connectWallet: Function;
  disconnect: Function;
  getProvider: Function;
  //provider?: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
};

const contextDefaultValues: AppContextProps = {
  connectedAccount: undefined,
  connectWallet: () => {},
  disconnect: () => {},
  getProvider: () => {},
};

export const BlockchainContext = createContext<AppContextProps>(contextDefaultValues);

type Props = {
  children: React.ReactNode;
};

export const BlockchainProvider = ({ children }: Props) => {
  const [connectedAccount, setConnectedAccount] = useState<string | undefined>();
  /*   const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
  >(); */

  const connectWallet = async () => {
    try {
      console.log("Connecting metamask...");
      const web3Modal = new Web3Modal({ cacheProvider: true });

      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      console.log("Provider ", provider);
      if (accounts) {
        //setProvider(provider);
        setConnectedAccount(accounts[0]);
      }
    } catch (error) {
      console.log("Error ", error);
    }
  };

  const getProvider = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    return new ethers.providers.Web3Provider(connection);
  };

  const disconnect = async () => {
    const web3Modal = new Web3Modal({ cacheProvider: true });
    if (web3Modal.cachedProvider) {
      web3Modal.clearCachedProvider();
      setConnectedAccount(undefined);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <BlockchainContext.Provider
      value={{ connectWallet, disconnect, getProvider, connectedAccount }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
