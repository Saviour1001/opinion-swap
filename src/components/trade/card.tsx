"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import { BsPeopleFill } from "react-icons/bs";
import { GiSandsOfTime } from "react-icons/gi";
import Input from "../form/input";
import { useRouter } from "next/navigation";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { networks } from "@/utils/constants";
import { parseEther } from "viem";
import toast from "react-hot-toast";

interface Card {
  description: string;
  votes: number;
  option1: string;
  option2: string;
  deadline: string;
  id: number;
}
let contractAddress: `0x${string}`;
let abi: any;

const Card = ({ description, votes, option1, option2, deadline, id }: Card) => {
  const [bet, setBet] = useState<number>(0);
  const [trade, setTrade] = useState<boolean>(false);
  const [option, setOption] = useState<string>("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { address, chain } = useAccount();
  const { data, writeContractAsync, status, error } = useWriteContract();
  const { isSuccess, status: isValid } = useWaitForTransactionReceipt({
    hash: data,
  });

  useEffect(() => {
    contractAddress = networks.find((network) => network.chain === chain?.name)
      ?.contract as `0x${string}`;
    abi = networks.find((network) => network.chain === chain?.name)?.abi;
  }, [chain?.name]);

  const placeBet = async () => {
    setIsLoading(true);
    writeContractAsync({
      account: address,
      address: contractAddress,
      abi: abi,
      functionName: "vote",
      args: [id, option === option1 ? 1 : 2, 0, parseEther(bet.toString())],
      value: parseEther(bet.toString()),
    });
  };

  useEffect(() => {
    if (status === "success" && isSuccess && isValid === "success") {
      setIsLoading(false);
      toast.success("Bet Placed Successfully", {
        style: {
          borderRadius: "10px",
        },
      });
    } else if (status === "error") {
      setIsLoading(false);
      toast.error("Something went wrong", {
        style: {
          borderRadius: "10px",
        },
      });
    }
  }, [status, isSuccess, isValid]);

  return (
    <div className="flex flex-col w-[25rem] h-[14rem] bg-[#141414] bg-opacity-70 border border-neutral-800 backdrop-filter backdrop-blur-sm rounded-xl shadow-md p-6 justify-between">
      <span className="flex flex-row items-center justify-between">
        <h2 className="w-[80%] text-xl text-neutral-200 font-primary font-medium truncate">
          {description}
        </h2>
        <button
          onClick={() => {
            !trade
              ? window.open(
                  `https://warpcast.com/~/compose?embeds[]=https://opinion-swap.vercel.app/bet?id=${id}`,
                  "_blank"
                )
              : setTrade(false);
          }}
          className="bg-amber-400 justify-center items-center px-2 rounded-lg w-8 h-8 font-bold cursor-pointer"
        >
          {!trade ? (
            <svg
              viewBox="0 0 323 297"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
            >
              <path
                d="M55.5867 0.733337H263.413V296.267H232.907V160.893H232.607C229.236 123.479 197.792 94.16 159.5 94.16C121.208 94.16 89.7642 123.479 86.3926 160.893H86.0933V296.267H55.5867V0.733337Z"
                fill="#7c3aed"
              />
              <path
                d="M0.293335 42.68L12.6867 84.6267H23.1733V254.32C17.9082 254.32 13.64 258.588 13.64 263.853V275.293H11.7333C6.46822 275.293 2.2 279.562 2.2 284.827V296.267H108.973V284.827C108.973 279.562 104.705 275.293 99.44 275.293H97.5333V263.853C97.5333 258.588 93.2651 254.32 88 254.32H76.56V42.68H0.293335Z"
                fill="#7c3aed"
              />
              <path
                d="M234.813 254.32C229.548 254.32 225.28 258.588 225.28 263.853V275.293H223.373C218.108 275.293 213.84 279.562 213.84 284.827V296.267H320.613V284.827C320.613 279.562 316.345 275.293 311.08 275.293H309.173V263.853C309.173 258.588 304.905 254.32 299.64 254.32V84.6267H310.127L322.52 42.68H246.253V254.32H234.813Z"
                fill="#7c3aed"
              />
            </svg>
          ) : (
            "x"
          )}
        </button>
      </span>
      {!trade ? (
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between items-center px-1">
            <span className="inline-flex items-center gap-2">
              <BsPeopleFill className="text-lime-200" />
              <p className="text-lime-300 text-lg font-primary truncate">
                {votes}
              </p>
            </span>
            <span className="inline-flex items-center gap-2">
              <GiSandsOfTime className="text-neutral-300" />
              <p className="text-neutral-400">{deadline}</p>
            </span>
          </div>
          <div className="flex flex-row justify-between items-center gap-2 mt-6">
            <button
              onClick={() => {
                setOption(option1);
                setTrade(true);
              }}
              className="w-[50%] p-2 text-lime-100 text-center bg-neutral-200/10 hover:bg-neutral-400/10 hover:border hover:border-lime-200/50 rounded-lg truncate"
            >
              {option1}
            </button>
            <button
              onClick={() => {
                setOption(option2);
                setTrade(true);
              }}
              className="w-[50%] p-2 text-lime-100 text-center bg-neutral-200/10 hover:bg-neutral-400/10 hover:border hover:border-lime-200/50 rounded-lg truncate"
            >
              {option2}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-4">
          <div>
            <Input
              id="bet"
              name="bet"
              placeholder="0.005 ETH"
              type="text"
              onChange={(e: { target: { value: SetStateAction<number> } }) =>
                setBet(e.target.value)
              }
            />
            <div className="flex-1 text-sm mt-1 font-primary text-neutral-300">
              Buy more crypto using Onramp powered by{" "}
              <span
                onClick={() => {
                  router.push("/onramp");
                }}
                className="text-lime-300 cursor-pointer underline underline-offset-1"
              >
                Unlimit
              </span>
            </div>
          </div>
          <button
            onClick={placeBet}
            className="w-full text-neutral-900 hover:text-neutral-800 bg-gradient-to-tr from-[#f0ffad] to-lime-300 hover:from-lime-200 hover:to-lime-300 rounded-lg px-5 py-2.5 text-center font-medium shadow disabled:opacity-75 disabled:cursor-progress"
            disabled={isLoading}
          >
            {isLoading ? (
              "Placing order..."
            ) : (
              <p>
                Bet {option} {bet > 0 && `(${(bet * 3100).toFixed(2)} USD)`}
              </p>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
