import { UserPosition } from './user-position';

export const getAaveUserPositions = async (userAddress: string): Promise<UserPosition[]> => {
  try {
    const url = `https://api.thegraph.com/subgraphs/id/QmdEuhCPTFx5q1Vf7jPQDVGQDpC34KYry82yb3NPc9sK6a`;

    const query = `
        {
        userReserves(where: { user: "${userAddress}" }) {
            reserve {
            name
            symbol
            liquidityRate
            }
            scaledATokenBalance
            usageAsCollateralEnabledOnUser
            currentVariableDebt
        }
        }
    `;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch aave user reserves`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching aave user reserves:", error);
    return [];
  }
};
