import { getAavePools } from "./aave-pools";
import { getAaveDailyVolume24h } from './aave-daily-volume-24h';
import { AavePlatformInfoResponse } from './schemas';

export const getAavePlatformInfo =
  async (): Promise<AavePlatformInfoResponse> => {
    const platformInfo: AavePlatformInfoResponse = {
      pools: await getAavePools(),
      dailyVolume24h: await getAaveDailyVolume24h(),
    };

    return platformInfo;
  };
