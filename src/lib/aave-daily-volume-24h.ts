import { DailyVolume24h } from '@/lib/daily-volume-24h';

export const getAaveDailyVolume24h = async (): Promise<DailyVolume24h | undefined> => {
  try {
    const response = await fetch(`https://aave-api-v2.aave.com/data/daily-volume-24-hours`);
    if (!response.ok) {
      throw new Error(`Failed to fetch daily volume 24h`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching aave pools:", error);
  }
};
