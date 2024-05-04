"use client";

import { GateFiDisplayModeEnum, GateFiSDK } from "@gatefi/js-sdk";
import { NextPage } from "next";
import { useEffect, useRef } from "react";

const Onramp: NextPage = () => {
  const embedInstanceSDK = useRef<GateFiSDK | null>(null);

  const createEmbedSdkInstance = () => {
    embedInstanceSDK.current = new GateFiSDK({
      merchantId: "9e34f479-b43a-4372-8bdf-90689e16cd5b",
      displayMode: GateFiDisplayModeEnum.Embedded,
      nodeSelector: "#embed",
      isSandbox: true,
      walletLock: true,
      fiatAmountLock: true,
      cryptoAmountLock: true,
      fiatCurrencyLock: true,
      cryptoCurrencyLock: true,
      successUrl: "http://localhost:3000?onramp=true",
      defaultFiat: {
        currency: "USD",
      },
      defaultCrypto: {
        currency: "ETH",
        amount: "0.005",
      },
    });
  };

  useEffect(() => {
    createEmbedSdkInstance();
    return () => {
      embedInstanceSDK.current?.destroy();
      embedInstanceSDK.current = null;
    };
  }, []);
  return (
    <div className="flex flex-col w-full pt-36 md:pt-28 pb-10 md:pb-6 px-10 md:px-24 gap-3 items-center justify-center mx-auto">
      <h1 className="text-xl md:text-2xl text-gray-200 font-primary font-medium">
        Onramp powered by Unlimit 💰
      </h1>
      <div>
        <div id="embed" style={{ width: "100%" }} />
      </div>
    </div>
  );
};

export default Onramp;
