import { Pool } from '@/lib/pool';

export const getAavePools = async (): Promise<Pool[]> => {
  try {
    const response = await fetch(`https://aave-api-v2.aave.com/data/pools`);
    if (!response.ok) {
      throw new Error(`Failed to fetch pools`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching aave pools:", error);
    return [];
  }
};
