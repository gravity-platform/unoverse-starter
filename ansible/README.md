# Gravity Platform Ansible Automation

Ansible playbooks for deployment, upgrades, and operations.

## Quick Start (Single VM)

You don't need to configure Ansible inventory or files for single-VM deployments.
Just use `.env.production` at the project root:

```bash
# 1. Configure production environment
cp .env.production.example .env.production
# Set DEPLOY_HOST, DEPLOY_USER, Redis, DOMAIN, etc.

# 2. Deploy
gravity deploy

# 3. Verify
gravity deploy test
```

The `gravity deploy` command reads `.env.production`, builds a temporary inventory, and runs the playbooks automatically.

## Structure

```
ansible/
├── inventory/
│   ├── production.yml.example  # ONLY for enterprise multi-VM setups
│   └── production.yml          # Your inventory (gitignored, multi-VM only)
├── playbooks/                  # All playbooks
├── templates/
│   └── Caddyfile.j2            # Caddy config template
└── ansible.cfg
```

## Direct Ansible Usage

For advanced use or multi-VM enterprise deployments:

```bash
cd ansible

# Single VM (reads .env.production from project root)
ansible-playbook -i inventory/production.yml playbooks/install.yml

# Multi-VM (target specific groups)
ansible-playbook -i inventory/production.yml playbooks/install.yml -l app_vms
ansible-playbook -i inventory/production.yml playbooks/install-umap.yml -l ml_vms
```

## Playbooks

| Playbook                | Purpose                                      |
| ----------------------- | -------------------------------------------- |
| `install.yml`           | Fresh install (Docker, images, services)     |
| `install-umap.yml`      | Install UMAP service (spatial search)        |
| `install-caddy.yml`     | Caddy reverse proxy with automatic TLS       |
| `deploy-packages.yml`   | Deploy packages (rsync from local + build)   |
| `db-setup.yml`          | Database setup and migrations                |
| `migrate-db.yml`        | Migrate database between providers           |
| `rollback.yml`          | Rollback to previous version                 |
| `health-check.yml`      | Verify all services healthy                  |
| `backup.yml`            | Backup UMAP models                           |
| `restore.yml`           | Restore UMAP models from backup              |
| `harden.yml`            | Security hardening (SSH, firewall, fail2ban) |
| `test-connectivity.yml` | Test VM connectivity and ports               |
| `uninstall-caddy.yml`   | Remove Caddy                                 |

## Requirements

- Ansible 2.12+
- SSH access to target VMs
- DOCR token (for pulling Docker images from DigitalOcean Container Registry)
