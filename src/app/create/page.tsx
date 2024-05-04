"use client";

import { NextPage } from "next";
import { Input } from "@/components";
import { SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { networks } from "@/utils/constants";

let contractAddress: `0x${string}`;
let abi: any;

const CreateCampaign: NextPage = () => {
  const [deadline, setDeadline] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [option1, setOption1] = useState<string>("");
  const [option2, setOption2] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { address, chain } = useAccount();
  const { data, writeContractAsync, status, isError } = useWriteContract();
  const {
    isSuccess,
    status: isValid,
    isError: isTxError,
  } = useWaitForTransactionReceipt({
    hash: data,
  });

  useEffect(() => {
    contractAddress = networks.find((network) => network.chain === chain?.name)
      ?.contract as `0x${string}`;
    abi = networks.find((network) => network.chain === chain?.name)?.abi;
  }, [chain?.name]);

  function formatTimestamp(deadline: string): number {
    const [day, month, year] = deadline.split(/\/|-/).map(Number);
    const date = new Date(year, month - 1, day);
    const timestamp = date.getTime() / 1000;
    return timestamp;
  }

  const createProposal = async () => {
    setIsLoading(true);
    writeContractAsync({
      account: address,
      address: contractAddress,
      abi: abi,
      functionName: "createProposal",
      args: [description, option1, option2, formatTimestamp(deadline)],
    });
  };

  useEffect(() => {
    if (status === "success" && isSuccess && isValid === "success") {
      setIsLoading(false);
      toast.success("Campaign Created Successfully", {
        style: {
          borderRadius: "10px",
        },
      });
    } else if (isError && isTxError) {
      setIsLoading(false);
      toast.error("Something went wrong", {
        style: {
          borderRadius: "10px",
        },
      });
    }
  }, [status, isSuccess, isValid, isError, isTxError]);

  return (
    <div className="flex-1 w-full pt-36 px-5 md:px-40 flex flex-col items-center">
      <span className="w-full flex md:justify-end mb-4">
        <button className="flex w-fit px-6 py-2.5 rounded-lg text-white border border-neutral-300 hover:bg-neutral-200 hover:text-black">
          Distribute Rewards
        </button>
      </span>
      <div className="w-full flex flex-col justify-evenly items-center gap-8 relative">
        <div className="relative flex place-items-center before:absolute before:h-[50px] before:w-[180px] sm:before:h-[200px] md:before:w-[780px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[200px] sm:after:h-[180px] sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-lime-200 after:via-lime-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-lime-500 before:dark:opacity-10 after:dark:from-lime-400 after:dark:via-[#01fff7] after:dark:opacity-40 before:lg:h-[260px] z-[-1]">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-title">
            Create Campaigns
          </h1>
        </div>
        {address ? (
          <form className="flex flex-col space-y-5 w-[90%] md:max-w-[600px] mx-auto">
            <Input
              id="description"
              name="description"
              label="Description"
              placeholder="Match IND vs. AUS"
              type="text"
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setDescription(e.target.value)
              }
              helper="This can be your description of campaign"
            />
            <div className="relative w-full">
              <p className="text-gray-300 text-sm md:text-[1.2rem]">Deadline</p>
              <div className="absolute inset-y-0 start-0 flex mt-10 ps-3.5 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
              </div>
              <input
                id="deadline"
                name="deadline"
                type="text"
                className="mt-2 bg-[#141414]/20 block w-full ps-10 p-2.5 font-primary border border-neutral-500 text-neutral-200 text-sm placeholder:text-neutral-500 rounded-lg focus:border-neutral-300 focus:ring-neutral-300 active:border-neutral-400 active:ring-neutral-400"
                placeholder="Select date"
                onChange={(e: { target: { value: SetStateAction<string> } }) =>
                  setDeadline(e.target.value)
                }
              />
            </div>
            <Input
              id="option1"
              name="option1"
              label="Option 1"
              placeholder="Target above 250"
              type="text"
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setOption1(e.target.value)
              }
              helper="This can be your first option"
            />
            <Input
              id="option2"
              name="option2"
              label="Option 2"
              placeholder="Target under 200"
              type="text"
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setOption2(e.target.value)
              }
              helper="This can be your second option"
            />
            <button
              onClick={async (e) => {
                e.preventDefault();
                if (deadline && description && option1 && option2) {
                  createProposal();
                } else {
                  toast.error("Please fill all the fields", {
                    style: {
                      borderRadius: "10px",
                    },
                  });
                }
              }}
              className="w-full text-neutral-900 hover:text-neutral-800 bg-gradient-to-tr from-[#f0ffad] to-lime-300 hover:from-lime-200 hover:to-lime-300 rounded-lg px-5 py-2.5 text-center font-medium shadow disabled:opacity-75 disabled:cursor-progress"
              disabled={isLoading}
            >
              {isLoading ? "Getting your campaign ready..." : "Add campaign 🚀"}
            </button>
          </form>
        ) : (
          <p className="text-xl font-primary text-lime-100">
            🔗 Please connect wallet
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateCampaign;
