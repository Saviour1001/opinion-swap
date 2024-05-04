/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/navigation";
import { baseSepolia } from "viem/chains";
import { useAccount } from "wagmi";

export default function Home() {
  const router = useRouter();
  const { chain } = useAccount();
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24 relative overflow-hidden'>
      <div className='flex flex-col gap-8 items-center justify-center text-center'>
        <img
          alt='asset'
          src='/images/asset-b.png'
          className='w-32 hidden md:flex absolute left-40 top-44 animate-wiggle'
        />
        <img
          alt='asset'
          src='/images/asset-a.png'
          className='w-32 hidden md:flex absolute left-0 bottom-10 animate-float'
        />
        <img
          alt='asset'
          src='/images/asset-c.png'
          className='w-40 hidden md:flex absolute right-40 top-32 animate-float'
        />
        <img
          alt='asset'
          src='/images/asset-d.png'
          className='w-40 hidden md:flex absolute right-8 bottom-20 animate-wiggle'
        />
        <p className='text-lg font-primary text-[#e5ffad]'>Earn crazy 🚀</p>
        <h1 className='text-6xl md:text-7xl font-title tracking-tight font-semibold'>
          <span className='text-transparent bg-clip-text bg-gradient-to-b from-[#d8ff4b] from-[20%] to-[#a6b62b]'>
            Built for new
            <br />
          </span>
          <span className='text-transparent bg-clip-text bg-gradient-to-b from-[#d8ff4b] from-[20%] to-[#a6b62b]'>
            beginnings
          </span>
        </h1>
        <p className='mt-5 max-w-2xl text-xl font-primary text-neutral-300'>
          Opinion Swap is a powerful, but simple, opinion trading platform that
          puts a wide selection of features at your fingertips. Now you can bet
          on live campaigns and earn{" "}
          <b className='text-[#efffb7]'>4x rewards</b> if you authenticate your
          World ID.
        </p>
        <button
          className='w-fit mt-5 px-7 py-2 text-lg text-neutral-800 font-primary font-medium bg-[#e5ffad]/90 hover:bg-[#e5ffad] border-2 border-neutral-100 hover:border-neutral-300 rounded-3xl'
          onClick={() => {
            router.push(`/trade?chainId=${chain?.id ?? baseSepolia.id}`);
          }}
        >
          Start trading
        </button>
      </div>
    </main>
  );
}
