"use client";

import { coinbaseWallet, injected } from "wagmi/connectors";
import { base } from "wagmi/chains";
import { createClient, http } from "viem";
import { createConfig } from "wagmi";
import { baseAttributionDataSuffix } from "./contract";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
    coinbaseWallet({
      appName: "Pixel Parcel",
      preference: { options: "all" },
    }),
  ],
  client({ chain }) {
    return createClient({
      chain,
      transport: http(),
      dataSuffix: baseAttributionDataSuffix,
    });
  },
  ssr: true,
});
