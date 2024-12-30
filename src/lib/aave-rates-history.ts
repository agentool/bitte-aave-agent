import { RateHistory } from './rate-history';

export const getAaveRatesHistory = async (reserveId: string, from: number, resolutionInHours: number): Promise<RateHistory[]> => {
  try {
    const response = await fetch(`https://aave-api-v2.aave.com/data/rates-history?reserveId=${reserveId}&from=${from}&resolutionInHours=${resolutionInHours}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch rates history`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching aave rates history:", error);
    return [];
  }
};
