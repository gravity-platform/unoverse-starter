# Gravity Platform Ansible Automation

Ansible playbooks for enterprise deployment, upgrades, and operations.

## Structure

```
ansible/
├── inventory/
│   ├── production.yml.example    # Production inventory template
│   └── staging.yml.example       # Staging inventory template
├── playbooks/
│   ├── install.yml               # Fresh installation
│   ├── upgrade.yml               # Rolling upgrade
│   ├── rollback.yml              # Rollback to previous version
│   ├── health-check.yml          # Verify all services healthy
│   └── backup.yml                # Backup PostgreSQL + UMAP models
├── roles/
│   └── gravity/
│       ├── tasks/
│       ├── templates/
│       └── handlers/
├── vars/
│   └── secrets.yml.example       # Secrets template (use ansible-vault)
└── ansible.cfg
```

## Quick Start

```bash
# 1. Configure inventory
cp inventory/production.yml.example inventory/production.yml
vim inventory/production.yml

# 2. Copy your .env file (from .env.example)
cp ../../.env.example files/.env
vim files/.env  # Fill in your values

# 3. Harden VMs (enterprise security)
ansible-playbook -i inventory/production.yml playbooks/harden.yml

# 4. Install Gravity services
ansible-playbook -i inventory/production.yml playbooks/install.yml

# 5. Run database setup
ansible-playbook -i inventory/production.yml playbooks/db-migrate.yml

# 6. Verify
ansible-playbook -i inventory/production.yml playbooks/health-check.yml
```

## Playbooks

| Playbook           | Purpose                                                 |
| ------------------ | ------------------------------------------------------- |
| `harden.yml`       | **Security hardening** - SSH, firewall, fail2ban, audit |
| `install.yml`      | Fresh installation on new VMs                           |
| `db-migrate.yml`   | Database setup (CREATE TABLE IF NOT EXISTS)             |
| `upgrade.yml`      | Rolling upgrade with zero downtime                      |
| `rollback.yml`     | Rollback to previous version                            |
| `health-check.yml` | Verify all services are healthy                         |
| `backup.yml`       | Backup database and UMAP models                         |

## Requirements

- Ansible 2.12+
- SSH access to target VMs
- Docker installed on target VMs
