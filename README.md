# Gravity Starter Template

Build custom AI experiences powered by the Gravity Platform.

## Quick Start

```bash
# 1. Install the Gravity CLI
npm install

# 2. Run the setup wizard
npx gravity init

# 3. Start the platform
npx gravity start
```

## CLI Commands

| Command | Purpose |
|---------|---------|
| `npx gravity init` | Interactive setup wizard |
| `npx gravity start` | Start the platform |
| `npx gravity stop` | Stop the platform |
| `npx gravity status` | Show service health |
| `npx gravity logs` | Stream logs |
| `npx gravity update` | Pull latest images and restart |
| `npx gravity doctor` | Diagnose issues |
| `npx gravity dev` | Start dev mode |

## Access

- **Canvas** (Workflow Builder): http://localhost:3001
- **API**: http://localhost:4100
- **Grafana** (Logs): http://localhost:3000

## Development

### Creating Custom Nodes

1. Create a new package in `packages/my-custom-node/`
2. Build: `npm run build -w @gravity-platform/my-custom-node`
3. Restart: `docker compose restart node-service workflow`

### Creating UI Components

1. Create component in `apps/design-system/storybook/components/`
2. Generate nodes: `npm run gen:nodes`
3. Restart: `docker compose restart node-service`

## Deployment (Production)

See `ansible/` for production deployment playbooks.
