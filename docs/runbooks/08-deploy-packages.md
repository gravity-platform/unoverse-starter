# Runbook: Deploy Packages

Deploy customer packages (custom nodes, design-system components) to the server.

## Prerequisites

- [ ] Core platform deployed ([01-core.md](./01-core.md))
- [ ] `starter_repo` set in `production.yml`
- [ ] Changes pushed to your starter repo

## Deploy

```bash
ansible-playbook -i inventory/production.yml playbooks/deploy-packages.yml
```

This playbook:

1. Clones `starter_repo` (from `production.yml`) to the server
2. Copies `packages/` and `apps/design-system/` to `/opt/gravity/`
3. Runs `npm install` + `npm run build` + `gen:nodes`
4. Restarts `node-service` to load the built packages

## Verify

```bash
ansible-playbook -i inventory/production.yml playbooks/test-connectivity.yml
```

Check the **Plugins & Packages** section — `plugins` should be > 0.

## Expected Output

```
PACKAGES DEPLOYED
============================================
Repo:   https://github.com/your-org/your-gravity.git (main)
Build:  OK
Restart: OK
============================================
```

## Troubleshooting

| Issue                  | Cause                 | Fix                                                                     |
| ---------------------- | --------------------- | ----------------------------------------------------------------------- |
| plugins=0 on server    | Packages not built    | Re-run `deploy-packages.yml`                                            |
| Build FAILED           | Missing dependency    | SSH in, run `cd /opt/gravity && npm install` manually                   |
| Clone fails            | Bad token or repo URL | Check `starter_repo` in `production.yml` and `PACKAGES_TOKEN` in `.env` |
| node-service unhealthy | Bad package code      | Check `docker compose logs node-service` on server                      |

## Related

- [01-core.md](./01-core.md) — Initial deployment
- [06-test.md](./06-test.md) — Full health check
