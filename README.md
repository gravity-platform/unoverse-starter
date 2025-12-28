# Gravity Starter Template

Build custom AI experiences powered by the Gravity Platform.

## Quick Start

```bash
# 1. Copy environment config
cp .env.example .env
# Edit .env with your database and OIDC settings

# 2. Deploy
./scripts/deploy.sh
```

## Access

- **Canvas** (Workflow Builder): http://localhost:3001
- **SAB** (Client App): http://localhost:3007

## Development

### Creating Custom Nodes

1. Create a new package in `packages/my-custom-node/`
2. Build: `npm run build -w @gravity-platform/my-custom-node`
3. Restart: `docker compose restart node-service`

### Creating UI Components

1. Create component in `apps/design-system/storybook/components/`
2. Generate nodes: `npm run gen:nodes`
3. Restart: `docker compose restart node-service`

## Documentation

See the [Developer Guide](https://github.com/gravity-platform/GravityPlatform/blob/main/docs/architecture/DEVELOPER_GUIDE.md) for full documentation.
