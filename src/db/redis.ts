"use server";

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const saveWorldId = async (address: string, hash: string) => {
  await redis.set(address, hash);
};

export const getWorldId = async (address: string) => {
  try {
    return (await redis.get(address)) as string | null;
  } catch (error) {
    console.error(`Failed to get data from Redis: ${error}`);
  }
};
