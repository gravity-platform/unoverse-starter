# Runbook: Test Connectivity

Verify all services are running and accessible.

## Overview

This runbook validates:
- Docker is running
- All containers are healthy
- Internal ports are open
- Health endpoints respond
- External access works (if Caddy installed)

## Prerequisites

- [ ] Core services deployed ([01-core.md](./01-core.md))
- [ ] Database configured ([02-database.md](./02-database.md))

## Steps

### 1. Run Connectivity Test

```bash
cd ansible
ansible-playbook -i inventory/production.yml playbooks/test-connectivity.yml
```

### 2. Manual Verification (Optional)

```bash
# SSH to VM
ssh root@<VM_IP>

# Check containers
docker compose ps

# Check logs
docker compose logs --tail=50 server
docker compose logs --tail=50 workflow
```

## Expected Output

```
CONNECTIVITY TEST RESULTS
============================================
Host: gravity-prod (YOUR_VM_IP)

Docker: OK

Port Status:
  - Canvas (3001): OK
  - Server (4100): OK
  - Workflow (4101): OK
  - Node Service (4102): OK
  - MCP Server (4103): OK
  - Redis (6379): OK

Health Endpoints:
  - Server: OK
  - Workflow: OK
  - Node Service: OK
  - MCP Server: OK

Caddy (external):
  - Port 80: OK
  - Port 443: OK
```

## Service Health Endpoints

| Service | URL | Expected |
|---------|-----|----------|
| Server | `http://localhost:4100/health` | 200 OK |
| Workflow | `http://localhost:4101/health` | 200 OK |
| Node Service | `http://localhost:4102/health` | 200 OK |
| MCP Server | `http://localhost:4103/health` | 200 OK |
| UMAP | `http://localhost:5001/health` | 200 OK |

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Container not running | Crashed on startup | Check logs: `docker compose logs <service>` |
| Health check failed | Missing env vars | Verify `.env` at `/opt/gravity/.env` |
| Port closed | Service not started | Restart: `docker compose restart <service>` |
| Database connection error | Wrong DATABASE_URL | Re-run [02-database.md](./02-database.md) |

## Quick Commands

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart server

# View logs
docker compose logs -f server

# Check resource usage
docker stats
```

## Next Steps

If all tests pass, your deployment is complete!

For ongoing operations:
- **Upgrades:** `ansible-playbook playbooks/upgrade.yml`
- **Backups:** `ansible-playbook playbooks/backup.yml`
- **Rollback:** `ansible-playbook playbooks/rollback.yml`
