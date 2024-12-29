import { RateHistory } from './rate-history';

export const getAaveRatesHistory = async (): Promise<RateHistory[]> => {
  try {
    const response = await fetch(`https://aave-api-v2.aave.com/data/rates-history`);
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
