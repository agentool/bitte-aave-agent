import { z } from "zod";

export const AaveRequestParamsSchema = z.object({
  account: z.string().describe("TODO"),
});

export const AaveResponseSchema = z.object({
  accountId: z.string().describe("TODO"),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
});

export type AaveRequestParams = z.infer<typeof AaveRequestParamsSchema>;
export type AaveResponse = z.infer<typeof AaveResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
