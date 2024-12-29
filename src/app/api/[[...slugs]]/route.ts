import { handle } from "hono/vercel";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { DEPLOYMENT_URL } from "vercel-url";
import {
  AaveDailyVolume24hResponseSchema,
  AavePoolsResponseSchema,
  AaveRateHistoryResponseSchema,
  ErrorResponseSchema,
} from "@/lib/schemas";
import { getAavePools } from '../../../lib/aave-pools';
import { getAaveDailyVolume24h } from '../../../lib/aave-daily-volume-24h';
import { getAaveRatesHistory } from '../../../lib/aave-rates-history';

const app = new OpenAPIHono();

const getAavePoolsRoute = createRoute({
  operationId: "get-aave-pools",
  description:
    "Get Aave platform staking pool(stkAAVE, stkABPT) stats",
  method: "get",
  path: "/api/aave/pools",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AavePoolsResponseSchema,
        },
      },
      description: "Successful response with aave staking pool(stkAAVE, stkABPT) stats",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Bad request",
    },
  },
});

const getAaveDailyVolume24hRoute = createRoute({
  operationId: "get-aave-daily-volume-24h",
  description:
    "Get the combined Volume of the Aave protocol for the last 24 hours window. Updated every 15 minutes",
  method: "get",
  path: "/api/aave/daily-volume-24h",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AaveDailyVolume24hResponseSchema,
        },
      },
      description: "Combined Volume of the Aave protocol for the last 24 hours window",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Bad request",
    },
  },
});


const getAaveRatesHistoryRoute = createRoute({
  operationId: "get-aave-rates-history",
  description:
    "Get Aave market rate history of a reserve over given time frames",
  method: "get",
  path: "/api/aave/rates-history",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AaveRateHistoryResponseSchema,
        },
      },
      description: "Market rate history of a reserve",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
        },
      },
      description: "Bad request",
    },
  },
});

app.openapi(getAavePoolsRoute, async (c) => {
  const aavePools = await getAavePools();
  return c.json(aavePools, 200);
});

app.openapi(getAaveDailyVolume24hRoute, async (c) => {
  const dailyVolume24h = await getAaveDailyVolume24h();
  return c.json(dailyVolume24h, 200);
});

app.openapi(getAaveRatesHistoryRoute, async (c) => {
  const ratesHistory = await getAaveRatesHistory();
  return c.json(ratesHistory, 200);
});

const key = JSON.parse(process.env.BITTE_KEY || "{}");
const config = JSON.parse(process.env.BITTE_CONFIG || "{}") as {
  url?: string;
};

if (!key?.accountId) {
  console.warn("Missing account info.");
}
if (!config || !config.url) {
  console.warn("Missing config or url in config.");
}

app.doc("/.well-known/ai-plugin.json", {
  openapi: "3.0.0",
  info: {
    title: "Bitte Aave API",
    description:
      "API that interacts with the Aave protocol.",
    version: "1.0.0",
  },
  servers: [{ url: config.url || DEPLOYMENT_URL }],
  "x-mb": {
    "account-id": key.accountId || "",
    assistant: {
      name: "Aave Assistant",
      description:
        "An assistant that provides information on Aave pools, strategies, rates, and more. It can send transactions on your behalf, facilitate borrowing and lending, and offer insights into your positions, portfolio, and current strategy recommendations.",
      instructions: "Get information about aave account.",
      tools: [{ type: "generate-transaction" }],
      image: (config?.url || DEPLOYMENT_URL) + "/aave-agent-logo.png",
    },
  },
});

app.get("/api/swagger", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Bitte Aave API Documentation</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
        <style>
          body {
            background: #1a1a1a;
            color: #ffffff;
          }
          .swagger-ui {
            filter: invert(88%) hue-rotate(180deg);
          }
          .swagger-ui .topbar { 
            display: none;
          }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              url: '/.well-known/ai-plugin.json',
              dom_id: '#swagger-ui',
              theme: 'dark'
            });
          };
        </script>
      </body>
    </html>
  `);
});

export const GET = handle(app);
export const POST = handle(app);
