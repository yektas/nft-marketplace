import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SpinnerProvider } from "../components/common/SpinnerContext";
import { Navbar } from "../components/navbar";
import Layout from "../components/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SpinnerProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SpinnerProvider>
  );
}

export default MyApp;
