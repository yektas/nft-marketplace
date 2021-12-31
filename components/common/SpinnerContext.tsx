import { createContext, ProviderProps, useContext, useState } from "react";
import Spinner from "./Spinner";

type ContextProps = {
  showSpinner: Function;
  hideSpinner: Function;
};

const SpinnerContext = createContext<ContextProps | null>({
  showSpinner: () => {},
  hideSpinner: () => {},
});

type Props = {
  children: React.ReactNode;
};

export function SpinnerProvider({ children }: Props) {
  const [loading, setLoading] = useState(false);
  const showSpinner = () => setLoading(true);
  const hideSpinner = () => setLoading(false);

  const value = { showSpinner, hideSpinner };
  return (
    <SpinnerContext.Provider value={value}>
      {loading && <Spinner />}
      {children}
    </SpinnerContext.Provider>
  );
}

export function useSpinner() {
  const context = useContext(SpinnerContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}
