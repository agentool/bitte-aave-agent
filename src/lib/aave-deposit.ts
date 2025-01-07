import { parseUnits, type Address } from "viem";
import { NextResponse } from 'next/server';
import {
  erc20Transfer,
  getTokenDetails,
  signRequestFor,
} from "@bitteprotocol/agent-sdk";
import { AaveDepositResponseSchema } from './schemas';
import { getTokenMap } from './utils';


const getLendingPoolAddress = async (): Promise<string> => {
  const response = await fetch('https://aave-api-v2.aave.com/data/pools');
  const data = await response.json();

  if (!data?.[0]?.address) {
    throw new Error("Failed to fetch lending pool address");
  }

  return data?.[0]?.address;
}

export const postAaveDeposit = async (amount: number, token: string): Promise<any> => {
  try {
    // TODO: make sure chainId is correct
    const chainId = 1;
    const lendingPoolAddress = await getLendingPoolAddress();
    
    const { decimals, address, symbol } = await getTokenDetails(
      chainId,
      token,
      await getTokenMap(),
    );

    console.log("erc20/ tokenDetails", amount, chainId, symbol, decimals, address);

    const transaction = signRequestFor({
      chainId,
      metaTransactions: [
        erc20Transfer({
          token: address,
          to: lendingPoolAddress as Address,
          amount: parseUnits(amount.toString(), decimals),
        }),
      ],
    });

    console.log("transaction", transaction);

    const response = NextResponse.json(
      {
        transaction
      },
      { status: 200 },
    )
    console.log("response", response);
    
    return transaction;
  } catch (error: unknown) {
    console.error("Error posting aave deposit:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 400 });
  }
};
