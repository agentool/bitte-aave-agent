# Bitte Aave Agent

Agent with access to the Aave platform, capable of providing information on pools, strategies, rates, and more. It can send transactions on your behalf, facilitate borrowing and lending, and offer insights into your positions, portfolio, and current strategy recommendations.

## Overview

Bitte Aave Agent is a tool that interacts with the Aave protocol.

Built using Next.js 14 + Shadcn/ui + Hono + Zod + Swagger UI.

## Backlog

- [x] Has access to aave platform, can give you info:
  - [ ] can offer insights into pools, strategies, rates, and more
- [ ] Has access to your aave account, can do actions on your behalf:
  - [x] can offer insights into your positions, portfolio, and current strategy recommendations
  - [ ] can facilitate borrowing and lending

## Project Walkthrough

Bitte Aave Agent facilitates the development of AI-powered tools for evaluating aave account. The template supports creating, managing, and deploying aave functionalities, starting with pool/strategies/rates/ etc.

### API Base URL

<https://bitte-aave-agent.vercel.app>

### Endpoints

- Aave Account Info `GET` `/api/aave/{account}`

### Usage

Make LLM requests to the endpoints above. Refer to the full API documentation for detailed parameter and response information.

## Getting Started

[Docs to integrate](https://docs.mintbase.xyz/ai/assistant-plugins)

### Installation

Set `NEAR_ENV="mainnet"` in your `.env.local` file.

```bash
# install dependencies
pnpm i

# start the development server
pnpm dev:next

# start the agent development server
pnpm dev:agent
```

## Deployment

Check out [Next.js deployment documentation](https://nextjs.org/docs/deployment) for details on (re-)deploying on Vercel.

### Agent registration

NOTE: Only run this once, when creating a new agent.

```bash
make-agent register -u https://bitte-aave-agent.vercel.app
```

### Agent redeployment

```bash
make-agent deploy -u https://bitte-aave-agent.vercel.app
```

## Troubleshooting

- Errors starting the Next.js development server:
  - Use ai to troubleshoot the error message
- Errors starting the agent development server:
  - Try again in 24 hours
- Unexpected response from the agent:
  - Check response from https://localhost:3000/.well-known/ai-plugin.json
  - Check response from your plugin API endpoints
  - Check the tunneling service url
- Error deploying the agent:
  - Check validity of https://bitte-aave-agent.vercel.app/.well-known/ai-plugin.json openapi schema
