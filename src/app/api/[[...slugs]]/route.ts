import { handle } from "hono/vercel";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { DEPLOYMENT_URL } from "vercel-url";
import {
  AaveRequestParamsSchema,
  AaveResponseSchema,
  ErrorResponseSchema,
} from "@/lib/schemas";

const app = new OpenAPIHono();

const getAaveRoute = createRoute({
  operationId: "TODO",
  description: "TODO",

  method: "get",
  path: "/api/aave/{accountId}",
  request: {
    params: AaveRequestParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AaveResponseSchema,
        },
      },
      description: "Successful response",
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

app.openapi(getAaveRoute, async (c) => {
  const { accountId } = c.req.param();
  if (!accountId) {
    return c.json({ error: `User ${accountId} not found` }, 400);
  }
  return c.json({ accountId }, 200);
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
    title: "Bitte Aave Agent API",
    description: "TODO",
    version: "1.0.0",
  },
  servers: [{ url: config.url || DEPLOYMENT_URL }],
  "x-mb": {
    "account-id": key.accountId || "",
    assistant: {
      name: "Aave Agent",
      description: "TODO",
      instructions: "TODO",
      image: (config?.url || DEPLOYMENT_URL) + "/TODO-agent-logo.png",
    },
  },
});

app.get("/api/swagger", (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Bitte Aave Agent API Documentation</title>
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
