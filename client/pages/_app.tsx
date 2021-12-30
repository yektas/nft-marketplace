import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SpinnerProvider } from "../components/common/SpinnerContext";
import { Navbar } from "../components/navbar";
import Layout from "../components/layout";
import { BlockchainProvider } from "../context/BlockchainContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BlockchainProvider>
      <SpinnerProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SpinnerProvider>
    </BlockchainProvider>
  );
}

export default MyApp;
