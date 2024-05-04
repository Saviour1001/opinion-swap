"use client";

import { Card } from "@/components";
import { getWorldId, saveWorldId } from "@/db/redis";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import { VscVerifiedFilled } from "react-icons/vsc";

interface TOpinion {
  description: string;
  votes: number;
  option1: string;
  option2: string;
  deadline: string;
  id: number;
}

interface TradeProps {
  data: TOpinion[];
}

const Trade = ({ data }: TradeProps) => {
  const { address } = useAccount();
  const [worldId, setWorldId] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      const fetchWorldId = async () => {
        const id = await getWorldId(address);
        if (id) {
          setWorldId(id as string);
        } else {
          setWorldId(null);
        }
      };
      fetchWorldId();
    }
  }, [address]);

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
      if (response.wldResponse.nullifier_hash && address) {
        await saveWorldId(address, response.wldResponse.nullifier_hash);
      }
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
        {worldId ? (
          <span className="flex flex-row gap-2 w-fit px-6 py-3 items-center rounded-lg bg-white hover:bg-neutral-200">
            Verified World ID
            <VscVerifiedFilled className="w-6 h-6 text-green-500" />
          </span>
        ) : (
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
        )}
      </div>
      <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
        {data.map((data, index) => (
          <Card key={index} {...data} />
        ))}
      </div>
    </div>
  );
};

export default Trade;
