---
sidebarTitle: "Overview"
---

# Unoverse Platform Onboarding

Welcome to Unoverse! Complete these challenges to learn the platform.

## Challenges

| #   | Challenge                                                      | What You'll Learn             |
| --- | -------------------------------------------------------------- | ----------------------------- |
| 1   | [Getting Started](./01-getting-started.md)                     | Clone, configure, deploy      |
| 2   | [Create Your First Agent](./02-create-your-first-agent.md)     | Build AI workflow in Canvas   |
| 3   | [Create Your First Node](./03-create-your-first-node.md)       | Custom node development       |
| 4   | [Ingest Content to Spatial](./04-ingest-content-to-spatial.md) | Spatial search, embeddings    |
| 5   | [Components and Templates](./05-components-and-templates.md)   | UI components, design system  |
| 6   | [Create a MCP](./06-create-a-mcp.md)                           | Expose workflow to ChatGPT    |
| 7   | [Create a Client App](./07-create-a-client-app.md)             | Connect a client app to the platform |
| 8   | [Deployment](./08-deployment.md)                               | Production, HTTPS, Caddy      |
| 9   | [Update Unoverse](./09-update-unoverse.md)                       | Update platform images        |

## Prerequisites

- **An unoverse license.** The platform ships as licensed Docker images; your registry token, issued with the license, authorizes downloading them. Without it, the starter is scaffold only and nothing runs.
- Docker 24+ (with Docker Desktop on Mac)
- Node.js 20+
- A PostgreSQL database and a Redis instance (yours: managed or local)
