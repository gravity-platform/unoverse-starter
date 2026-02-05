# Gravity Starter Template

Build custom AI experiences powered by the Gravity Platform.

## Quick Start (Ansible)

```bash
# 1. Configure environment
cp .env.example .env
nano .env  # Set DATABASE_URL, REDIS_*, AUTH_* variables

# 2. Deploy via Ansible
cd ansible
export GHCR_USERNAME=your-github-username
export GHCR_TOKEN=ghp_your_pat
ansible-playbook -i inventory/production.yml playbooks/install.yml
```

## Access

- **Canvas** (Workflow Builder): https://yourdomain.com
- **API**: https://api.yourdomain.com

> **Note:** SAB (client app) is deployed separately to CDN (Vercel/Netlify).

## Ansible Playbooks

| Playbook | Purpose |
|----------|---------|
| `install.yml` | First-time install (Docker, services, health checks) |
| `upgrade.yml` | Pull new GHCR images and restart |
| `install-caddy.yml` | Install Caddy with TLS |
| `health-check.yml` | Check service health |
| `rollback.yml` | Rollback to previous version |

## Development

### Creating Custom Nodes

1. Create a new package in `packages/my-custom-node/`
2. Build: `npm run build -w @gravity-platform/my-custom-node`
3. Restart: `docker compose restart node-service`

### Creating UI Components

1. Create component in `apps/design-system/storybook/components/`
2. Generate nodes: `npm run gen:nodes`
3. Restart: `docker compose restart node-service`
