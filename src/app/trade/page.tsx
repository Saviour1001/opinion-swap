"use client";

import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { NextPage } from "next";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

const Trade: NextPage = () => {
  const [nullifierHash, setNullifierHash] = useState();
  const { address } = useAccount();
  async function handleVerify(data: any) {
    data.signal = address;
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res.json());
    if (response.code === "success") {
      setNullifierHash(response.wldResponse.nullifier_hash);
      toast.success("Successfully authenticated with World ID.");
    } else {
      toast.error("Authenticated failed with World ID.");
    }
  }
  const onSuccess = () => {
    console.log("🔥 Verified successfully!");
  };

  return (
    <div className="flex flex-col w-full pt-36 pb-20 md:pt-32 md:pb-6 lg:py-28 px-10 md:px-24">
      <div className="flex flex-row w-full justify-between items-center">
        <h1 className="text-2xl md:text-3xl text-gray-200 font-primary font-medium">
          Trade on Live Opinions ⚡️
        </h1>
        <IDKitWidget
          app_id={process.env.NEXT_PUBLIC_APP_ID as `app_${string}`}
          action={process.env.NEXT_PUBLIC_ACTION_ID!}
          onSuccess={onSuccess}
          handleVerify={handleVerify}
          signal={address}
          verification_level={VerificationLevel.Device}
        >
          {({ open }) => (
            <button
              className="w-fit px-6 py-3 rounded-lg bg-white hover:bg-neutral-200"
              onClick={open}
            >
              Verify with World ID
            </button>
          )}
        </IDKitWidget>
      </div>
      <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3"></div>
    </div>
  );
};

export default Trade;
