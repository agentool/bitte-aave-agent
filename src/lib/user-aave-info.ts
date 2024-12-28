import { Position } from "@/lib/position";

export interface AavePositionsResponse {
  accountId: string;
  positions: Position[];
}

export const getUserAavePositions = async (
  accountId: string
): Promise<AavePositionsResponse> => {
  // if account has no suffix, then append .near,
  // but only if no suffix present and if the account is not a hash
  if (!accountId.includes(".") && !/^[0-9a-fA-F]{64}$/.test(accountId)) {
    accountId = `${accountId}.near`;
  }

  const positions: Position[] = [
  ];

  return {
    accountId: accountId,
    positions
  };
};
