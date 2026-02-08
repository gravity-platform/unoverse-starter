# Runbook: AI Model (UMAP)

Deploy the UMAP AI service for semantic search and spatial embeddings.

## Overview

UMAP (Uniform Manifold Approximation and Projection) provides:

- Semantic search capabilities
- Spatial embeddings for content similarity
- Need-aware search (finds content by intent, not just keywords)

## VM Requirements

| Tier                 | Cores | RAM   | Storage    | Notes                            |
| -------------------- | ----- | ----- | ---------- | -------------------------------- |
| **POC**              | —     | —     | —          | Runs on same VM as core services |
| **Enterprise ML VM** | 4     | 16 GB | 100 GB SSD | Dedicated VM for AI workloads    |

## Prerequisites

- [ ] Core services deployed ([01-core.md](./01-core.md))
- [ ] Database configured ([02-database.md](./02-database.md))
- [ ] For Enterprise: Dedicated ML VM provisioned

## Deployment Options

| Tier       | Where UMAP runs | Configuration                             |
| ---------- | --------------- | ----------------------------------------- |
| POC        | Same VM as core | `UMAP_SERVICE_URL=http://umap:5001`       |
| Enterprise | Dedicated ML VM | `UMAP_SERVICE_URL=http://<ML_VM_IP>:5001` |

## Steps

### POC (Same VM)

UMAP is included in the standard `install.yml` playbook. No additional steps needed.

### Enterprise (Dedicated ML VM)

#### 1. Add ML VM to Inventory

```yaml
# ansible/inventory/production.yml
ml_vms:
  hosts:
    ml-1:
      ansible_host: <ML_VM_PRIVATE_IP>
      ansible_user: root
```

#### 2. Deploy UMAP

```bash
cd ansible
ansible-playbook -i inventory/production.yml playbooks/install-umap.yml -l ml_vms
```

#### 3. Configure App VMs to Use ML VM

Update `.env` on App VMs:

```
UMAP_SERVICE_URL=http://<ML_VM_PRIVATE_IP>:5001
```

Then restart services:

```bash
ansible-playbook -i inventory/production.yml playbooks/upgrade.yml -l app_vms
```

### 4. Verify

```bash
# Test UMAP health
curl http://<ML_VM_IP>:5001/health

# Or from App VM
curl http://localhost:5001/health  # POC
curl http://<ML_VM_IP>:5001/health  # Enterprise
```

## Expected Output

```
UMAP SERVICE DEPLOYED
============================================
Host: ml-1 (10.0.1.20)
Service: umap-service
Port: 5001
Health: OK
```

## Troubleshooting

| Issue                          | Cause            | Fix                                |
| ------------------------------ | ---------------- | ---------------------------------- |
| Model loading slow             | First startup    | Wait 2-3 minutes for model to load |
| Out of memory                  | Insufficient RAM | Increase VM to 16GB+               |
| Connection refused from App VM | Firewall         | Allow App VM → ML VM on port 5001  |

## Next Steps

- [04-harden.md](./04-harden.md) - Security hardening
