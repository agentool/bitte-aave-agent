import { BlockchainMapping, loadTokenMap } from '@bitteprotocol/agent-sdk';
import { clsx, type ClassValue } from "clsx";
import { unstable_cache } from 'next/cache';
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not set`);
  }
  return value;
}

export async function getTokenMap(): Promise<BlockchainMapping> {
  const getCachedTokenMap = unstable_cache(
    async () => {
      console.log("Loading TokenMap...");
      return loadTokenMap();
    },
    ["token-map"], // cache key
    {
      revalidate: 86400, // revalidate 24 hours
      tags: ["token-map"],
    },
  );

  return getCachedTokenMap();
}