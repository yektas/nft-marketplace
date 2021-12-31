import { useEffect, useState, createContext, FC } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

export type AppContextProps = {
  connectedAccount: string | undefined;
  connectWallet: Function;
  disconnect: Function;
  getProvider: Function;
};

export const BlockchainContext = createContext<AppContextProps>({} as AppContextProps);

type Props = {
  children: React.ReactNode;
};

export const BlockchainProvider = ({ children }: Props) => {
  const [connectedAccount, setConnectedAccount] = useState<string | undefined>();

  const connectWallet = async (firstTime: boolean = false) => {
    try {
      console.log("Connecting metamask...");
      const web3Modal = new Web3Modal({ cacheProvider: true });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      if (accounts) {
        setConnectedAccount(accounts[0]);

        if (firstTime) {
          localStorage.setItem("connected", accounts[0]);
        }
      }
    } catch (error) {
      console.log("Error ", error);
    }
  };

  const getProvider = async () => {
    if (connectedAccount == undefined) {
      return;
    }
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    return new ethers.providers.Web3Provider(connection);
  };

  const disconnect = async () => {
    const web3Modal = new Web3Modal({ cacheProvider: true });
    if (web3Modal.cachedProvider) {
      web3Modal.clearCachedProvider();
      setConnectedAccount(undefined);
      localStorage.removeItem("connected");
    }
  };

  const checkIsWalletConnected = async () => {
    const connected = localStorage.getItem("connected");

    if (connected != null) {
      console.log("connected ", connected);
      connectWallet();
    }
  };

  useEffect(() => {
    checkIsWalletConnected();
  }, []);

  return (
    <BlockchainContext.Provider
      value={{ connectWallet, disconnect, getProvider, connectedAccount }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
