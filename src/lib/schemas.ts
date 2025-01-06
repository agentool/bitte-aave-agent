import { z } from "zod";

export const AavePoolSchema = z.object({
  liquidity: z.object({
    usd: z.number(),
    eth: z.number(),
    native: z.number(),
  }),
  price: z.object({
    eth: z.number(),
    usd: z.number(),
  }),
  address: z.string().describe("The address of the pool").openapi({
    example: "0x1234567890abcdef1234567890abcdef12345678",
  }),
  apy: z.number(),
  name: z.string().openapi({
    example: "Staked Aave Balance Pool Token",
  }),
  symbol: z.string().openapi({
    example: "stkABPT",
  }),
  updatedAt: z.string().datetime().openapi({
    example: "2021-02-12T15:19:20.571Z",
  }),
});

export const ReserveSchema = z.object({
  id: z.string(),
  aToken: z.string(),
  asset: z.string(),
  pool: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  priceInEth: z.string(),
  borrow: z.number(),
  deposit: z.number(),
  repay: z.number(),
  withdrawal: z.number(),
});

export const AaveDailyVolume24hSchema = z.object({
  totalVolumeInUsd: z.number(),
  totalVolumeInEth: z.number(),
  totalBorrowUSD: z.number(),
  totalBorrowETH: z.number(),
  totalRepayETH: z.number(),
  totalRepayUSD: z.number(),
  totalDepositETH: z.number(),
  totalDepositUSD: z.number(),
  totalWithdrawalUSD: z.number(),
  totalWithdrawalETH: z.number(),
  totalStakedETH: z.number(),
  totalStakedUSD: z.number(),
  totalRedeemedUSD: z.number(),
  totalRedeemedETH: z.number(),
  reserves: z.object({
    v1: z.array(ReserveSchema),
    v2: z.array(ReserveSchema),
    stk: z.array(ReserveSchema),
      asset: z.string(),
      symbol: z.string(),
      decimals: z.number(),
      priceInEth: z.string(),
      stake: z.number(),
      redeem: z.number(),
    })
});

export const AaveRateHistorySchema = z.object({
  liquidityRate_avg: z.number(),
  variableBorrowRate_avg: z.number(),
  utilizationRate_avg: z.number(),
  stableBorrowRate_avg: z.number(),
  x: z.object({
    year: z.number(),
    month: z.number(),
    date: z.number(),
    hours: z.number(),
  })
});

export const UserPositionSchema = z.object({
  data: z.object({
    userReserves: z.array(
      z.object({
        reserve: z.object({
          name: z.string().openapi({ example: "Dai Stablecoin" }),
          symbol: z.string().openapi({ example: "DAI" }),
          liquidityRate: z.string().openapi({ example: "0.025" }),
        }),
        scaledATokenBalance: z.string().openapi({ example: "1000000000000000000000" }),
        usageAsCollateralEnabledOnUser: z.boolean().openapi({ example: true }),
        currentVariableDebt: z.string().openapi({ example: "500000000000000000000" }),
      })
    ),
  }),
});

// TODO
export const AaveDepositSchema = z.object({
  transaction: z.object({
    chainId: z.number(),
    metaTransactions: z.array(z.object({
      token: z.string(),
      to: z.string(),
      amount: z.string(),
    })),
  }),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
});

export const AavePoolsResponseSchema = z.array(AavePoolSchema);
export const AaveDailyVolume24hResponseSchema = AaveDailyVolume24hSchema;
export const AaveRateHistoryResponseSchema = z.array(AaveRateHistorySchema);
export const AaveUserPositionsResponseSchema = z.array(UserPositionSchema);
export const AaveDepositResponseSchema = AaveDepositSchema;

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type Pool = z.infer<typeof AavePoolSchema>;
export type DailyVolume24h = z.infer<typeof AaveDailyVolume24hSchema>;
export type RateHistory = z.infer<typeof AaveRateHistorySchema>;
export type UserPosition = z.infer<typeof UserPositionSchema>;

export type AavePoolsResponseSchema = z.infer<typeof AavePoolsResponseSchema>;
export type AaveDailyVolume24hResponseSchema = z.infer<typeof AaveDailyVolume24hResponseSchema>;
export type AaveRateHistoryResponseSchema = z.infer<typeof AaveRateHistoryResponseSchema>;
export type AaveUserPositionsResponseSchema = z.infer<typeof AaveUserPositionsResponseSchema>;
export type AaveDepositResponseSchema = z.infer<typeof AaveDepositResponseSchema>;