import { Trade } from "@/components";
import { networks } from "@/utils/constants";
import { createPublicClient, getContract, http } from "viem";
import { baseSepolia } from "viem/chains";

const TradePage = async () => {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const contract = getContract({
    address: networks[0].contract as `0x${string}`,
    abi: networks[0].abi,
    client,
  });

  const totalProposals = (await contract.read.proposalCount([])) as number;

  type TProposal = {
    description: string;
    option1: string;
    option2: string;
    deadline: string;
    id: number;
    votes: number;
  };

  let allProposals: TProposal[] = [];

  function timestampToDateString(timestamp: number) {
    const date = new Date(timestamp * 1000);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  const fetchProposals = async () => {
    for (let i = 1; i <= totalProposals; i++) {
      const proposal = (await contract.read.proposals([i])) as string[];
      const deadline = timestampToDateString(Number(proposal[3]));
      allProposals.push({
        description: proposal[0],
        option1: proposal[1],
        option2: proposal[2],
        deadline,
        id: i,
        votes: Number(proposal[4]) + Number(proposal[5]),
      });
    }
  };

  await fetchProposals();

  return (
    <>
      <Trade data={allProposals} />
    </>
  );
};

export default TradePage;
