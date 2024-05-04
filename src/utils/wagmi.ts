import { createConfig } from "wagmi";
import {
  base,
  baseSepolia,
  mantleSepoliaTestnet,
  optimism,
} from "wagmi/chains";
import { getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    chains: [baseSepolia, base, optimism, mantleSepoliaTestnet],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    appName: "OpinionSwap",
    ssr: true,
  })
);

export default config;
