# Runbook: Deploy Packages

Deploy customer packages (custom nodes, design-system components) to the server.

## Prerequisites

- [ ] Core platform deployed ([01-core.md](./01-core.md))
- [ ] `.env.production` configured with `DEPLOY_HOST`
- [ ] Changes built locally (packages have `dist/`)

## Deploy

```bash
gravity deploy packages
```

Or manually via Ansible:

```bash
cd ansible
ansible-playbook -i inventory/production.yml playbooks/deploy-packages.yml
```

This playbook:

1. Rsyncs `packages/` and `apps/design-system/` from your local machine to the server
2. Runs `npm install` + `turbo build` on the server
3. Restarts `node-service` to load the built packages

## Verify

```bash
gravity deploy test
```

Check the **Plugins & Packages** section — `plugins` should be > 0.

## Expected Output

```
PACKAGES DEPLOYED
============================================
Mode:    rsync (local)
Build:   OK
Restart: OK
============================================
```

## Troubleshooting

| Issue                  | Cause                 | Fix                                                    |
| ---------------------- | --------------------- | ------------------------------------------------------ |
| plugins=0 on server    | Packages not built    | Re-run `gravity deploy packages`                       |
| Build FAILED           | Missing dependency    | SSH in, run `cd /opt/gravity && npm install` manually  |
| rsync permission error | SSH key not set up    | Check `DEPLOY_HOST` and `DEPLOY_USER` in `.env.production` |
| node-service unhealthy | Bad package code      | Check `docker compose logs node-service` on server     |

## Related

- [01-core.md](./01-core.md) — Initial deployment
- [06-test.md](./06-test.md) — Full health check
