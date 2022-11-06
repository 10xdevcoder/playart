import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ReactNotifications } from "react-notifications-component";
import "@rainbow-me/rainbowkit/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { connectorsForWallets, lightTheme } from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";
import {
  injectedWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import "react-notifications-component/dist/theme.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { BrowserRouter as Router } from "react-router-dom";
import { MoralisProvider } from "react-moralis";
import Footer from "./components/Footer/Footer";

export const binanceSmartChain = {
  id: 97,
  name: "BSC Testnet",
  network: "Binance Smart Chain Testnet",
  iconUrl:
    "https://gateway.pinata.cloud/ipfs/QmfFWYYi1HECxne3wTpvHKsek9aNDbPzDNxNAfiNmhPTxv",
  iconBackground: "#000000",
  nativeCurrency: {
    decimals: 18,
    name: "Binance",
    symbol: "tBNB",
  },
  rpcUrls: {
    default: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  },
  blockExplorers: {
    default: { name: "BscScan", url: "https://testnet.bscscan.com" },
    etherscan: { name: "BscScan", url: "https://testnet.bscscan.com" },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [chain.polygonMumbai /*, binanceSmartChain*/],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }),
    publicProvider(),
  ]
);
const CustomTheme = merge(lightTheme(), {
  colors: {
    connectButtonBackground: "#5bb8eb",
    accentColor: "#5bb8eb",
    accentColorForeground: "#000000",
    connectButtonTextError: "#000000",
  },
});

const connectors = connectorsForWallets([
  {
    groupName: "Popular",
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ chains }),
      metaMaskWallet({ chains }),
      coinbaseWallet({ chains, appName: "ReFund" }),
      walletConnectWallet({ chains }),
      ledgerWallet({
        chains: chains,
        infuraId: process.env.REACT_APP_INFURA_ID,
      }),
      trustWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        showRecentTransactions={true}
        coolMode={true}
        modalSize="compact"
        chains={chains}
        theme={CustomTheme}
      >
        <Router>
          <MoralisProvider
            serverUrl={process.env.REACT_APP_SERVER_URL}
            appId={process.env.REACT_APP_APPLICATION_ID}
          >
            <ReactNotifications />
            <App />
            <Footer />
          </MoralisProvider>
        </Router>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
