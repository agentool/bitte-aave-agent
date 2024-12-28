import { handle } from "hono/vercel";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { DEPLOYMENT_URL } from "vercel-url";
import {
  AavePlatformInfoResponseSchema,
  ErrorResponseSchema,
} from "@/lib/schemas";
import { getAavePlatformInfo } from '@/lib/platform-info';

const app = new OpenAPIHono();

const getAavePlatformInfoRoute = createRoute({
  operationId: "get-aave-platform-info",
  description:
    "Get Aave platform info including pools, strategies, rates, and more.",
  method: "get",
  path: "/api/aave/platform-info",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AavePlatformInfoResponseSchema,
        },
      },
      description: "Successful response with aave platform info",
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

app.openapi(getAavePlatformInfoRoute, async (c) => {
  const platformInfo = await getAavePlatformInfo();
  return c.json(platformInfo, 200);
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
